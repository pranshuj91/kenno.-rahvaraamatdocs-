---
id: order-purchase-flow
title: Order Purchase Flow
sidebar_label: Order Purchase Flow
---
### Order purchase flow (end-to-end)

This document describes, in detail, what happens during the order checkout and fulfillment pipeline across the API and console layers. It follows the three stages you specified:

1) API checkout: POST api/checkout/index
2) Every 2 minutes: console/order/process (post-payment order processing)
3) Every 30 minutes: NAV order synchronization (orderSync via SyncController)

The sections below trace objects, methods, status transitions, and side-effects so you can correlate logs and metrics with runtime behavior.


### API checkout (POST checkout/index)

1) User checks out: api/checkoutController/index
- Entry point: api/controllers/CheckoutController::actionIndex()
  - Validates that the basket is non-empty via getBasket(); otherwise 400 Bad Request.
  - Builds CheckoutForm with the current Basket and client IP.
  - Runs CheckoutForm::validateBasket(); if validation fails, returns 422 with validation messages.
  - On POST with valid form data:
    - Instantiates api\orders\OrderCheckoutService with the Basket.
    - Calls OrderCheckoutService::checkout($checkoutForm) which creates a new Order in the database (status NEW), calculates totals, persists order lines, applies delivery/payment selections, and binds the order to the current web store and client account.
    - Returns api\serializers\RedirectSerializer pointing to BankController::actionCreateForm with query params orderId and checksum.
      - The JSON looks like: \{ "location": "https://.../bank/create-form?orderId=...&checksum=..." \}

### Bank payment create-form & return

- Next redirect: api/controllers/BankController::actionCreateForm(int $orderId, string $checksum)
  - Resolves the Order by id and checksum; validates it is eligible for payment.
  - If the order is marked as “no bank payment” (e.g., free/zero total, or a method that doesn’t require a bank page):
    - Returns PaymentRedirectForm that points the user to a web checkout URL to finalize without external bank pages.
  - Otherwise (standard bank payment):
    - Creates api\payments\initiators\OrderPaymentInitiator($order).
    - OrderPaymentInitiator::getBankPaymentRequest() does the following:
      - Verifies the order is still NEW (prevents double payments); otherwise throws InvalidArgumentException.
      - Constructs an OrderTransactionInitializer with the order and client IP and initializes a payment transaction record.
      - Picks the payment adapter (EveryPay) and prepares a BankPaymentRequest (URL + POST body for the bank or PSP).
      - Persists the payment form payload onto the Payment, marks Payment status = WAITING, and marks the Order as PENDING_PAYMENT.
    - BankController returns api\models\forms\PaymentRedirectForm that front-end auto-submits to the bank/PSP.

- Bank returns/callbacks: api/controllers/BankController::actionReturnInternal($language)
  - Wraps the inbound request in api\payments\BankReturnedRequest (payload + client IP).
  - Hands it to api\payments\BankReturnedRequestHandler which, using OrderTransactionRepository, verifies the transaction and builds a transaction result.
  - The result is processed by api\payments\handlers\OrderTransactionResultHandler:
    - If 3-D Secure or additional auth is required, returns another auto-submit HTML form to continue the bank flow.
    - If this is a bank’s silent/backup ping, returns 200 OK immediately.
    - Otherwise, redirects to the final summary URL (success or failure). The summary page data is served by BankController::actionPaymentResult, which returns either OrderSuccessfulSummaryPageSerializer or OrderFailureSummaryPageSerializer for the app to render.

### Order status transitions

- Typical order status transitions during step 1
  - NEW → (actionCreateForm) → PENDING_PAYMENT
  - From callbacks: if authorized/captured → PENDING_PROCESSING (eligible for step 2); if failed/canceled → a failure state handled by step 2 logic as well.


### console/order/process (post-payment)

2) Cron (every 2 minutes): console/orderController/actionProcess
- Entry point: console/controllers/OrderController::actionProcess()
  - Concurrency guard: AlreadyRunningFilter prevents overlapping runs.
  - Targets:
    - If --orderId is provided, processes only that order with force=true (ignores prior state checks).
    - Otherwise, processes all orders in Order::find()->pendingProcessing(). These are typically paid/authorized orders waiting for fulfillment actions.

- Per-order processing
  - Constructs common\purchases\OrderPurchaseManager($order) and calls ->process($force).
    - Internally performs the post-payment business logic:
      - Allocates/reserves stock where needed, issues digital entitlements (e.g., download rights), updates internal flags, and transitions the order status (e.g., PENDING_PROCESSING → COMPLETED/PROCESSING or appropriate next state depending on fulfillment rules).
      - Records failures for later handling when something goes wrong.
  - After process(), invokes ->handlePurchasingResult([...]) with handlers:
    - PostBackHandler: triggers outbound notifications/webhooks to external systems if configured.
    - EmailNotificationHandler: sends confirmation emails and any other purchase-related messages to the customer.
    - FailedOrderHandler: applies remediation logic when a purchase failed (e.g., status updates, releasing stock, logging).
  - Logs success/failure per order.

- After all orders
  - Sets system flag lastOrderProcess = time() for monitoring.
  - If postToNav=true (default):
    - Instantiates common\synchronizations\nav\post\order\OrderPost and runs it.
    - OrderPost posts/republishes orders to NAV that failed to post previously, ensuring eventual consistency with NAV.

- Related utility: actionProcessPendingNonRefundableState
  - For audio products, checks refundability (api\modules\audio\purchase\AudioRefundStateChecker). If an order is not refundable, it is returned to PENDING_PROCESSING for standard handling.


### NAV order synchronization

3) Cron (every ~30 minutes): Order sync with NAV
- Mechanism: dynamic sync action via console/controllers/SyncController and common\synchronizations\SyncHandlerFactory.
  - The handler class is common\synchronizations\nav\sync\OrderSync. You can run it via php yii sync/`<handlerName>` (see php yii help sync or the factory for the exact action id).

- What OrderSync does
  - Fetches order data from NAV tables through a staging process:
    - Posted/processed orders: [w_posted_documents] (NAV’s projection of posted sales documents).
    - Open/unprocessed orders: [w_open_orders] (sales headers still open in NAV).
    - Only website-originated orders are considered (codes starting with WT% / WN%, and customer codes starting with W%).
  - Loads both sources into temporary tables (OrderLedgerTable and OrderTable) and then merges them into a single temporary table for processing.
  - Within a DB transaction, updates matching orders that were created in RR:
    - Updates order totals, and quantity/price of existing order items.
    - Does not insert new items into existing orders.
  - Optional scoping: you can provide a specific web store NAV code (webStoreNavCode) to limit the sync.

- Why this matters in the flow
  - NAV is the system of record for postings and some final financials. The 30-minute order sync reconciles our local orders with NAV data, ensuring amounts and statuses reflect back-office reality.
  - Combined with the 2-minute processing loop (which handles business-side fulfillment and notifications) and the immediate bank callbacks, this provides both near-real-time customer experience and periodic back-office reconciliation.


Operational tips
- Endpoints involved
  - Checkout: POST /checkout (api/controllers/CheckoutController::actionIndex)
  - Bank form creation: GET /bank/create-form?orderId=..&checksum=..
  - Bank return handler: GET|POST /bank/return-internal
  - Payment result meta: POST /bank/payment-result

- Console jobs
  - Process orders: php yii order/process [--orderId=ID] [--postToNav=0|1]
  - Sync orders with NAV: php yii sync/`<order-sync-handler>` [--webStoreNavCode=WEB|WEB2]

- Status checkpoints to look for in logs
  - NEW → PENDING_PAYMENT (when creating bank request)
  - PENDING_PAYMENT → PENDING_PROCESSING (after successful payment)
  - PENDING_PROCESSING → next (after OrderPurchaseManager::process)

- Notifications and integrations
  - Emails: via EmailNotificationHandler (after processing)
  - External callbacks/webhooks: via PostBackHandler
  - NAV posting retries: via OrderPost (immediately after processing run)

- Error handling highlights
  - Duplicate payment attempts for non-NEW orders are blocked in OrderPaymentInitiator.
  - actionProcess is guarded by AlreadyRunningFilter to avoid overlapping runs.
  - BankController gracefully handles 3-D Secure flows and bank ‘backup’ pings.


## See also
- ./PAYMENT_SYSTEM.md — payment adapter and callback architecture
- ./ORDER_HANDLING_BY_CLIENT_TYPE.md — differences by client type
- ../reference/ADMIN_MODULE.md — admin views related to orders and sync tools
- ../reference/CONSOLE_COMMANDS_SUMMARY.md — console commands (order processing, sync)




