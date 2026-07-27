---
id: payment-overview
title: Payment Overview
sidebar_label: Payment Overview
---
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



