---
id: payment-integration
title: Payment Integration
sidebar_label: Payment Integration
---

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
