---
id: IB-001-payment-gateway
title: IB-001 — Payment Gateway Integrations
sidebar_label: IB-001 Payment Gateway
---

# IB-001 — Payment Gateway Integrations

| Field | Value |
|---|---|
| Priority | Important |
| Category | Business |
| Gap item | Payment Gateway Integrations |
| Description | EveryPay, Bank links, Open Banking — payment flow, callbacks, reconciliation |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Related Developer Docs

- `docs/commerce-ordering/PAYMENT_SYSTEM.md`
- `docs/commerce-ordering/PAYMENT.md`
- `docs/commerce-ordering/Payment Integration.md`

## Documentation

> This topic was added to Developer Docs and is shown here so the team can review the documented coverage for this gap in one place.


---

### Developer Docs — `docs/commerce-ordering/PAYMENT_SYSTEM.md`

# Payment System

This document describes the payment gateway integrations, payment flow, callback handling, and recurring billing.

## Overview

Rahva Raamat uses **EveryPay** as the primary payment gateway, supporting:
- One-time payments (card, bank links, open banking)
- Recurring/subscription payments via MIT (Merchant Initiated Transactions)
- Saved credit card tokenization

The integration uses the `swiftmade/omnipay-everypay` Omnipay package.

## Architecture

```
Customer checkout
  → Payment initiation (API)
  → Redirect to EveryPay hosted page
  → Customer completes payment
  → EveryPay callback → API callback endpoint
  → EveryPayCallbackHandler processes result
  → Order/Subscription status updated

Recurring billing (cron):
  → SubscriptionController::bill()
  → EveryPaySubscriptionBillService
  → MIT transaction via saved card token
  → EveryPayBillService::bill()
  → Result handler updates subscription
```

## Key Components

### Gateway Configuration

**File:** `api/payments/everypay/Gateway.php`

EveryPay gateway configuration. Settings managed via admin panel at `admin/modules/setting/controllers/IntegrationController.php`.

### One-Time Payment Flow

1. **Initiation:** Customer selects payment method at checkout
2. **Redirect:** Customer is redirected to EveryPay's hosted payment page
3. **Callback:** After payment, EveryPay sends callback to the API
4. **Processing:** `EveryPayCallbackHandler` processes the bank-returned payment notification

### EveryPay Callback Handler

**File:** `api/payments/everypay/EveryPayCallbackHandler.php`

Handles bank-returned payment notifications:
- Routes to appropriate transaction handler (Order or Subscription)
- Processes payment result (success/failure)
- Updates order or subscription status accordingly

**Async processing:** `common/models/jobs/EveryPayCallbackHandlerJob.php` — Queued job for processing callbacks asynchronously via the queue system.

### MIT Billing Service

**File:** `api/payments/everypay/EveryPayBillService.php`

Handles Merchant Initiated Transactions for recurring payments:
- Uses saved credit card tokens
- Processes purchase responses
- Used by subscription billing system

### MIT Payment Request

**File:** `api/payments/everypay/Messages/MitPaymentRequest.php`

Formats MIT payment requests with required parameters for EveryPay.

## Subscription Billing

**File:** `common/subscription/EveryPaySubscriptionBillService.php`

Recurring subscription billing flow:
1. Mark subscription as pending
2. Validate client account and credit card
3. Create pending transaction via `SubscriptionPaymentInitiator`
4. Execute MIT transaction via `EveryPayBillService`
5. Handle result via `SubscriptionBillTransactionResultHandler`

On failure: `FailedPaymentSubscriptionHandler` marks as failed and sends notification email.

See `./SUBSCRIPTION_MANAGEMENT.md` for full subscription details.

### Payment Initiator

**File:** `api/payments/initiators/SubscriptionPaymentInitiator.php`

Creates pending payment transactions for subscription billing.

### Transaction Handlers

**File:** `api/payments/handlers/SubscriptionBillTransactionResultHandler.php`

Routes successful/failed billing results to the appropriate subscription handler.

### Transaction Repository

**File:** `api/payments/transactions/repositories/SubscriptionTransactionRepository.php`

Database access layer for subscription payment transactions.

## Console Commands

```bash
# Bill upcoming subscriptions
php yii subscription/bill
```

## Admin Configuration

**File:** `admin/modules/setting/controllers/IntegrationController.php`

Admin interface for managing:
- EveryPay API credentials
- Payment method configuration
- Gateway settings

## Error Handling

- Payment failures update order/subscription status appropriately
- Failed subscription billing sends notification email to customer (`SubscriptionBillingFailedMessageComposer`)
- Callback handler uses queue-based async processing for reliability
- MIT billing validates credit card presence and validity before attempting charge


---

### Developer Docs — `docs/commerce-ordering/PAYMENT.md`

# Payment System

For the current payment system with EveryPay and internal flows, see ./PAYMENT_SYSTEM.md.

# Description of old solution

## AdaptersAbstract
Related to:
- `PaymentHandlerBase`.

Has properties:
- tag. The tag of adapter
- configuration data.

functionality:
- `signWithPrivateKey()` Signs a given string with a private key specified by a relative configuration path.
- `formatParams()` Format all added parameters as described in the parameter definition (cast to string, truncate length).
  * Related to the `Dataset`
- `getParamMacOrderDefinition()` Defines MAC parameters for each service type.
- `getParamDefinition()`  Returns the definition (with max lengths) of MAC parameters.
- `verifySignatureWithCertificate()` Verifies that the signature is correct for the specified data using a given certificate.

## Dataset
Related to:
- `AdaptersAbstract`.

Has properties:
- adapter. instance of `AdaptersAbstract`
- params. Parameter array for this dataset.

functionality:
- data transfer object.

## PaymentHandlerBase
Related to:
- `AdapterFactory`.

Has properties:
- configuration of all adapters.
- list of all available adapters as entities.

functionality:
- `createService()` returns `ServicesAbstract` by passed param.


## ServicesAbstract
Related to:
- `PaymentHandlerBase`.

functionality:
- `loadAdapters()` Load supported adapters for this service ??

heirs:
- `Payment`

## Payment
Related to:
- `Transaction`.
- Extend `ServicesAbstract`.

functionality:
- `generateForms()` Generates payment forms for all enabled adapters.
- `handleResponse()` Handles the response received from the server after payment
- `createTransaction()` Create a new transaction object

## Transaction
functionality:
- `create()` Create a new transaction object by ID and amount.
- `generateReference()` Generate a reference number based on transaction ID.


## AdapterInterface
Related to:
- `Response`.
- `Transaction`.
- `Dataset`.

functionality:
* `fillPaymentFormDataset()`  Returns a dataset describing a payment form for this adapter
* `canHandlePaymentResponse()` Returns TRUE if an adapter can handle a payment response
* `handlePaymentResponse()` Handles the payment response from the payment provider.
* `loadTransactionFromResponse()` Loads a transaction by the response's parameters


## IPizza
Related to:
- Extends `AdaptersAbstract`
- Implements `AdapterInterface`

heirs:
- `Coop`
- `SwedBank`
- `LHV`
- `Seb`
- `Nordea`

## SwedCard
Related to:
- `RequestFactory`. 
- `ResponseAnalyzer`.
- `SwedCardRequester`.

functionality:
* `canHandlePaymentResponse()` Check is response contains one of the next param:
  * `dts_reference` external transaction ID
  * `PaRes` 3D secure hash param. 
  * `repeatedQuery` boolean, is request made using pre-saved payment token.
* `handlePaymentResponse()`
  * If the response from repeated query then `makeRepeatedQueryAndFinalize()`
  * `checkTransactionQuery()` using reference received from `'dts_reference'`.
    * if response has param `'PaRes'` then 3D secure is needed. `makeVerifyRequest()`.
    * `SwedCardRequester.authorize()` using `'dts_reference'`.
      * if `ResponseAnalyzer.if3dRequestNeeded()` then generating 3D secure form and redirect customer to the merchant pages.
      * if `ResponseAnalyzer.canBeProcessedWithout3dSecurity()` then `makeVerifyRequest()`.
      * if `ResponseAnalyzer.isAccepted` then `transactionAccepted()`.
* `makeVerifyRequest()` Send `SwedCardRequester.verify`
  * If `ResponseAnalyzer.isAccepted()` then  `transactionAccepted()`.
  * else `transactionFailed()`.
  
* `transactionAccepted()` 
  * Save credit card info if exists.
  * Creating `RrPayment` from `RrOrder`.
  * save entities.

* `transactionFailed()`
  * Creating `RrPayment` from `RrOrder`.
  * save entities.
  
* `loadTransactionFromResponse()` Set transaction properties from response. List of the properties:
  * `'transactionID'`
  * `'reference'`
  * `'amount'`
  * `'status'`
  * `'currency'`
  
* `makeRepeatedQueryAndFinalize()` make `SwedCardRequester.payWithToken()` and analyze the response.
  

### RequestFactory
functionality:
* `buildSetupRequest()` Build SOAP request XML for receiveing payment redirect URL.
* `buildAuthorizationRequest()` Build SOAP request XML.
* `buildFinishVerifyRequest()` Build last request to verify transaction.
* `buildCheckTransactionQuery()` Build SOAP request XML for getting transaction state.
* `buildRepeatQuery()` Build SOAP request XML for making payment using credit card token.

### ResponseAnalyzer
Related to:
* `AuthorizationStatus`
* `PurchaseStatus`


functionality:
* `getRedirectUrl()` Return url received from response for making redirect.
* `extractReferenceFromResponse()` Return `'datacash_reference'` of the response.
* `if3dRequestNeeded()` check is 3D secure needed by response status ID.
* `canBeProcessedWithout3dSecurity()`check is payment can be processed without 3D secure by response status ID.
* `getReference()` Return `'merchant_reference'` from the response.
  * `'merchant_reference'` is our hash of payment.
* `getCreditCardInformation()` Return array of meta info about used credit card.

### SwedCardRequester
Related to:
* `SetupParams`
* `RrOrder`
* `RrUser`
* `GuzzleHttp\Client`

functionality:
* `sendSetupRequest()` Send `RequestFactory.buildSetupRequest()`.
* `payWithToken()` Send `RequestFactory.buildRepeatQuery()`.
* `checkTransactionQuery()` Send `RequestFactory.buildCheckTransactionQuery()`.
* `authorize()` Send `RequestFactory.buildAuthorizationRequest()`.
* `authorizeZeroAmount()` Send `RequestFactory.buildAuthorizationRequest()`.
* `verify()` Send `RequestFactory.buildFinishVerifyRequest()`.


## Transaction
functionality:
- data transfer object of the next params:
  * `id` => `RrPayment->id`
  * `amount` => `RrPayment->amount`
  * `reference` => `RrOrder->reference`
  * `comment`.
  
Related to:
* PaymentController::actionForm
  * Used for passing params to the payment form generation.
* BankController::actionReturn
  * Used for receive the payment.

## Payment related actions

### PaymentController::actionForm
functionality:
* Check is order status correct
* Create RrPayment
* Create transaction
* Generate payment POST form
* Handle generation exceptions

### BankController::actionReturn
functionality:
* Handle received response from the bank.
  * find the adapter that can handle response.
  * Create Response object using adapter.  
  * Create transaction from response.
  * Get payment by transaction.
  * Get order by payment.
  * Check is order in a right condition to receive payment.
  * Check received payment status and process scenarios.
  
#### Order/Payment processing roadmap
Base state:
* order with status: PENDING_PAYMENT
* Payment with status: STATUS_STARTED

##### BankLink
Don't change the order status && payment status.
Return response based on received bank request.
Response attributes:
* isSuccessful
* isAutomatic
* transaction
  * TransactionID
  * Reference
  * Sum
  * Comment
  * Currency* Language
  

##### DataCash (Swedcard)
Change the order status && payment status.
Can set the next values:
* Order processed successful:
  * mark payment as STATUS_COMPLETED.
  * mark order as PENDING_PROCESSING.
* Order was failed:
  * mark payment as STATUS_CANCELLED.
  * mark order as PAYMENT_FAILED.


##### Common processing:
1. Get payment with order by transaction ID.
2. if order status is PENDING_PAYMENT:
  1. Mark payment as failed if response isn't successful.
  2. Payment validation
  3. if payment status is STATUS_WAITING then finalize the order with status PENDING_PROCESSING.
  4. if payment status is STATUS_COMPLETED then
    * check is order status not PENDING_PAYMENT or not PAYMENT_FAILED.
  5. if payment status is STATUS_CANCELLED then:
  * mark order as failed.
3. if order status in list then order processed successful. List:
  * PENDING_NAV_SYNC
  * PROCESSING
  * PENDING_NAV_PROCESSING
  * COMPLETED
  * PENDING_PROCESSING

  then order processed successful


---

### Developer Docs — `docs/commerce-ordering/Payment Integration.md`

# Payment Integration

## Overview

Rahvaraamat integrates with multiple payment gateways and methods to provide secure, flexible payment processing for customers. The system supports traditional payment methods like credit cards and bank transfers, as well as modern solutions like Open Banking and digital wallets.

## Payment Architecture

### Payment Flow
```
Customer → Payment Method Selection → Payment Gateway → Authorization → Confirmation → Order Completion
```

### Core Components
- **Payment Gateway Adapters**: Interface with external payment services
- **Payment Processors**: Handle payment logic and validation
- **Transaction Managers**: Manage payment state and reconciliation
- **Security Layer**: Ensure PCI compliance and data protection

## Supported Payment Methods

### 1. Credit/Debit Cards
- **Visa**: All major Visa card types
- **MasterCard**: Credit and debit cards
- **American Express**: AMEX cards
- **Local Cards**: Estonian bank cards (Swedbank, SEB, LHV)

### 2. Bank Transfers
- **SEPA Transfers**: European bank transfers
- **Local Bank Transfers**: Estonian bank transfers
- **Instant Transfers**: Real-time bank transfers (PIS)

### 3. Digital Wallets
- **Apple Pay**: iOS device payments
- **Google Pay**: Android device payments
- **PayPal**: International payments

### 4. Buy Now, Pay Later
- **Klarna**: Interest-free installment payments
- **Clearpay**: Split payment solutions

### 5. Local Payment Methods
- **Cash on Delivery**: COD payments
- **Cash in Shop**: In-store payments
- **Gift Cards**: Store credit and vouchers

## Payment Gateway Integration

### Swedbank Payment Gateway
The Swedbank Gateway provides:
- Swedbank payment processing logic
- API communication with Swedbank
- Response handling and validation
- Callback processing

**Key Features:**
- Secure payment processing
- Real-time transaction updates
- Comprehensive error handling
- Multi-currency support

**Configuration Parameters:**
- Merchant ID
- API Key
- Environment (production/test)
- Callback URLs
- Return URLs

### SEB Payment Gateway
The SEB Gateway offers:
- SEB payment processing logic
- API communication with SEB
- Response handling and validation
- Callback processing

**Key Features:**
- Bank-specific payment methods
- Secure authentication
- Real-time processing
- Error handling

### LHV Payment Gateway
The LHV Gateway provides:
- LHV payment processing logic
- API communication with LHV
- Response handling and validation
- Callback processing

**Key Features:**
- Local bank integration
- Secure payment processing
- Real-time updates
- Comprehensive logging

### EveryPay Integration
The EveryPay Gateway offers:
- EveryPay payment processing logic
- API communication with EveryPay
- Response handling and validation
- Callback processing

**Key Features:**
- Multiple payment methods
- Secure processing
- Real-time updates
- Error handling

## Payment Processing Models

### Payment Request
The Payment Request contains:
- Order identification details
- Payment amount and currency
- Payment method selection
- Customer information
- Billing and shipping addresses
- Order items
- Additional metadata

**Required Fields:**
- Order ID
- Amount
- Currency
- Payment method ID
- Customer data
- Address information

### Payment Response
The Payment Response includes:
- Success status
- Transaction identification
- Payment status
- Redirect information
- Error details
- Additional metadata

**Response Types:**
- Success responses
- Error responses
- Pending responses
- Redirect responses

### Payment Callback
The Payment Callback contains:
- Transaction identification
- Payment status
- Amount and currency
- Timestamp information
- Security signature
- Additional metadata

**Callback Processing:**
- Signature validation
- Status updates
- Database updates
- Customer notifications

## Payment API Endpoints

### POST /payment/process
**Purpose**: Process payment for an order

**Request Fields:**
- **orderId**: Order identifier (e.g., 12345)
- **paymentMethodId**: Payment method identifier (e.g., 1)
- **paymentData**: Payment method specific data (e.g., card details)

**Response Fields:**
- **success**: Payment success status
- **transactionId**: Unique transaction identifier
- **status**: Payment status (e.g., "authorized")
- **redirectUrl**: Redirect URL if required
- **amount**: Payment amount
- **currency**: Payment currency

### POST /payment/callback/\{gateway\}
**Purpose**: Handle payment gateway callbacks

**Request**: Gateway-specific callback data

**Response Fields:**
- **success**: Callback processing success status
- **message**: Processing result message

### GET /payment/status/\{transactionId\}
**Purpose**: Check payment status

**Response Fields:**
- **paymentId**: Payment identifier
- **status**: Payment status (e.g., "completed")
- **amount**: Payment amount
- **currency**: Payment currency
- **timestamp**: Payment timestamp
- **orderId**: Associated order identifier

## Payment Security

### PCI DSS Compliance
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Tokenization**: Credit card data replaced with secure tokens
- **Access Control**: Strict access controls for payment data
- **Audit Logging**: Comprehensive logging of all payment activities

### Fraud Prevention
- **3D Secure**: 3DS authentication for card payments
- **Risk Scoring**: AI-powered fraud detection
- **Velocity Checks**: Transaction frequency monitoring
- **Geographic Validation**: Location-based fraud detection

### Data Protection
- **GDPR Compliance**: European data protection compliance
- **Data Minimization**: Only necessary payment data stored
- **Right to Erasure**: Customer data deletion capabilities
- **Consent Management**: Explicit consent for payment processing

## Payment Workflows

### Credit Card Payment Flow
1. **Card Input**: Customer enters card details
2. **Validation**: Client-side and server-side validation
3. **3D Secure**: 3DS authentication if required
4. **Authorization**: Payment gateway authorization
5. **Confirmation**: Payment confirmation and order completion

### Bank Transfer Flow
1. **Method Selection**: Customer selects bank transfer
2. **Order Creation**: Order created with pending payment status
3. **Bank Details**: Bank account details provided to customer
4. **Transfer**: Customer initiates bank transfer
5. **Reconciliation**: Payment reconciliation and order confirmation

### Digital Wallet Flow
1. **Wallet Selection**: Customer selects digital wallet
2. **Wallet Authentication**: Customer authenticates with wallet
3. **Payment Authorization**: Wallet authorizes payment
4. **Confirmation**: Payment confirmation and order completion

## Payment Reconciliation

### Automatic Reconciliation
- **Real-time Updates**: Payment status updates in real-time
- **Webhook Processing**: Gateway webhook handling
- **Status Synchronization**: Payment status synchronization

### Manual Reconciliation
- **Bank Statement Import**: CSV/Excel import for bank transfers
- **Manual Matching**: Manual payment-to-order matching
- **Dispute Resolution**: Payment dispute handling

### Reconciliation Reports
- **Daily Reconciliation**: Daily payment reconciliation reports
- **Exception Reports**: Unreconciled payment reports
- **Audit Trails**: Complete payment audit trails

## Error Handling

### Payment Failures
```json
{
    "success": false,
    "errorCode": "PAYMENT_DECLINED",
    "errorMessage": "Payment was declined by the bank",
    "suggestions": [
        "Check card details",
        "Ensure sufficient funds",
        "Contact your bank"
    ]
}
```

### Gateway Errors
```json
{
    "success": false,
    "errorCode": "GATEWAY_UNAVAILABLE",
    "errorMessage": "Payment gateway temporarily unavailable",
    "retryAfter": "2024-01-10T11:00:00Z"
}
```

### Validation Errors
```json
{
    "success": false,
    "errorCode": "VALIDATION_ERROR",
    "errors": {
        "cardNumber": ["Invalid card number format"],
        "expiryMonth": ["Expiry month must be between 1 and 12"]
    }
}
```

## Payment Testing

### Test Environment
- **Test Cards**: Predefined test card numbers
- **Test Accounts**: Test bank accounts and wallets
- **Sandbox Mode**: Isolated testing environment

### Test Scenarios
- **Successful Payments**: Test successful payment flows
- **Failed Payments**: Test various failure scenarios
- **Partial Payments**: Test partial payment handling
- **Refunds**: Test refund processing

### Test Data
```json
{
    "testCards": {
        "4111111111111111": "Visa (success)",
        "5555555555554444": "MasterCard (success)",
        "4000000000000002": "Visa (declined)",
        "4000000000009995": "Visa (insufficient funds)"
    }
}
```

## Payment Analytics

### Key Metrics
- **Success Rate**: Payment success percentage
- **Conversion Rate**: Checkout to payment conversion
- **Average Transaction Value**: Mean payment amount
- **Payment Method Distribution**: Usage by payment method

### Performance Monitoring
- **Response Times**: Payment processing response times
- **Error Rates**: Payment failure rates
- **Gateway Performance**: Individual gateway performance
- **Customer Experience**: Payment flow completion rates

### Reporting
- **Daily Reports**: Daily payment summaries
- **Monthly Reports**: Monthly payment analytics
- **Custom Reports**: Customizable payment reports
- **Export Capabilities**: Data export in various formats

## Compliance and Regulations

### PSD2 Compliance
- **Strong Customer Authentication**: SCA requirements
- **Open Banking**: API access for third-party providers
- **Payment Initiation**: Third-party payment initiation
- **Account Information**: Account information services

### Local Regulations
- **Estonian E-commerce Law**: Local e-commerce requirements
- **EU Consumer Rights**: European consumer protection
- **Tax Compliance**: VAT and tax reporting
- **Data Localization**: Data storage requirements

### International Compliance
- **GDPR**: European data protection
- **PCI DSS**: Payment card industry standards
- **SOX**: Financial reporting compliance
- **ISO 27001**: Information security management

## Troubleshooting

### Common Issues
- **Payment Declined**: Check card details and funds
- **Gateway Timeout**: Retry payment or contact support
- **Callback Failures**: Verify webhook configuration
- **Reconciliation Issues**: Check payment matching logic

### Debug Tools
- **Payment Logs**: Detailed payment processing logs
- **Gateway Logs**: External gateway communication logs
- **Transaction Traces**: Complete transaction flow traces
- **Error Reports**: Comprehensive error reporting

### Support Resources
- **Documentation**: Complete integration documentation
- **API Reference**: Detailed API endpoint documentation
- **Support Team**: Technical support contact information
- **Community Forum**: Developer community support


