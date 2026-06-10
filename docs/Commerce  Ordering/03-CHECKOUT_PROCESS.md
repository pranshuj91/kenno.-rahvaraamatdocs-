---
id: checkout-process
title: Checkout Process
sidebar_label: Checkout Process
---

# Checkout Process

## Overview

The checkout process in Rahvaraamat is a multi-step workflow that converts a user's basket into a completed order. The system supports both guest and authenticated user checkouts with comprehensive validation and error handling.

## Checkout Flow Architecture

### 1. Basket Validation
- **Stock Availability Check**: Validates all products have sufficient inventory
- **Price Validation**: Ensures prices haven't changed since basket creation
- **Product Status Check**: Verifies products are still available for purchase
- **Basket Token Validation**: Ensures basket integrity and session validity

### 2. User Authentication/Registration
- **Guest Checkout**: Allows users to checkout without account creation
- **User Login**: Existing users can authenticate during checkout
- **Account Creation**: New users can register during checkout process
- **Session Management**: Maintains checkout state across steps

### 3. Delivery Information
- **Shipping Address**: Collection and validation of delivery details
- **Billing Address**: Separate billing information if different from shipping
- **Delivery Method Selection**: Available shipping options with pricing
- **Delivery Time Calculation**: Estimated delivery dates based on method

### 4. Payment Processing
- **Payment Method Selection**: Available payment gateways and options
- **Payment Validation**: Credit card validation, bank account verification
- **Payment Authorization**: Secure payment processing and authorization
- **Payment Confirmation**: Payment success/failure handling

### 5. Order Confirmation
- **Order Creation**: Final order record creation in database
- **Inventory Reservation**: Stock allocation and reservation
- **Email Notifications**: Order confirmation and receipt emails
- **Order Tracking**: Order number generation and tracking setup

## Checkout Components

### Basket Component
```php
// api/components/BasketComponent.php
class BasketComponent extends Component
{
    public function getModel(): Basket
    {
        // Returns current basket instance
    }
    
    public function validateForCheckout(): bool
    {
        // Validates basket for checkout readiness
    }
}
```

### Checkout Service
```php
// api/orders/OrderCheckoutService.php
class OrderCheckoutService
{
    public function processCheckout(CheckoutForm $form): Order
    {
        // Main checkout processing logic
    }
    
    public function validateDelivery(DeliveryForm $form): bool
    {
        // Delivery information validation
    }
}
```

### Checkout Form Models
```php
// api/models/forms/basket/CheckoutForm.php
class CheckoutForm extends Model
{
    public $shippingName;
    public $shippingEmail;
    public $shippingPhone;
    public $shippingAddress;
    public $shippingCity;
    public $shippingPostcode;
    public $shippingCountryNavCode;
    public $billingName;
    public $billingEmail;
    public $billingPhone;
    public $billingAddress;
    public $billingCity;
    public $billingPostcode;
    public $billingCountryNavCode;
    public $deliveryMethodId;
    public $paymentMethodId;
    public $notes;
    public $termsAccepted;
    public $newsletterSubscription;
}
```

## Checkout API Endpoints

### POST /checkout
**Purpose**: Process the complete checkout and create order

**Request Headers**:
- `store`: Web store identifier (required)
- `basket-token`: Basket session token (optional)
- `Authorization`: User authentication token (optional)

**Request Body**:
```json
{
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "shippingPhone": "+37251234567",
    "shippingAddress": "123 Main St",
    "shippingCity": "Tallinn",
    "shippingPostcode": "10115",
    "shippingCountryNavCode": "EE",
    "deliveryMethodId": 1,
    "paymentMethodId": 2,
    "notes": "Please deliver after 6 PM",
    "termsAccepted": true,
    "newsletterSubscription": false
}
```

**Response**:
```json
{
    "success": true,
    "order": {
        "id": 12345,
        "referenceNumber": "ORD-2024-001",
        "status": "pending",
        "totalAmount": 29.99,
        "deliveryAmount": 4.99,
        "estimatedDelivery": "2024-01-15"
    },
    "redirectUrl": "https://payment-gateway.com/checkout/12345"
}
```

### GET /checkout/meta
**Purpose**: Retrieve checkout metadata (delivery methods, payment methods, countries)

**Response**:
```json
{
    "deliveryMethods": [
        {
            "id": 1,
            "name": "Omniva Parcel Terminal",
            "price": 2.99,
            "estimatedDays": "2-3",
            "description": "Pickup from nearest parcel terminal"
        }
    ],
    "paymentMethods": [
        {
            "id": 1,
            "name": "Credit Card",
            "description": "Visa, MasterCard, American Express"
        }
    ],
    "countries": [
        {
            "navCode": "EE",
            "name": "Estonia",
            "isDefault": true
        }
    ]
}
```

## Checkout Validation Rules

### Address Validation
- **Required Fields**: Name, email, phone, address, city, postcode, country
- **Email Format**: Valid email address format
- **Phone Format**: International phone number format
- **Postcode Format**: Country-specific postcode validation
- **Address Length**: Minimum and maximum character limits

### Delivery Validation
- **Method Availability**: Selected delivery method must be available
- **Geographic Coverage**: Delivery method must cover shipping address
- **Time Restrictions**: Delivery method must be available for selected time
- **Price Calculation**: Delivery cost must be calculated correctly

### Payment Validation
- **Method Availability**: Selected payment method must be available
- **Amount Limits**: Payment method must support order amount
- **Currency Support**: Payment method must support store currency
- **Security Requirements**: Payment method security validation

## Error Handling

### Validation Errors
```json
{
    "success": false,
    "errors": {
        "shippingEmail": ["Invalid email format"],
        "deliveryMethodId": ["Selected delivery method is not available"]
    }
}
```

### Business Logic Errors
```json
{
    "success": false,
    "error": "Insufficient stock for product 'Book Title'",
    "errorCode": "INSUFFICIENT_STOCK"
}
```

### System Errors
```json
{
    "success": false,
    "error": "Payment processing temporarily unavailable",
    "errorCode": "PAYMENT_SERVICE_UNAVAILABLE"
}
```

## Checkout Security

### CSRF Protection
- CSRF tokens required for all checkout requests
- Token validation on form submission
- Session-based token generation

### Input Sanitization
- HTML entity encoding for all user inputs
- SQL injection prevention
- XSS protection measures

### Payment Security
- PCI DSS compliance
- Encrypted payment data transmission
- Secure payment gateway communication

## Performance Considerations

### Caching Strategy
- Delivery method pricing cached
- Country and region data cached
- Payment method availability cached
- Basket data cached with TTL

### Database Optimization
- Optimized queries for checkout data
- Connection pooling for high traffic
- Transaction isolation for order creation

### API Response Optimization
- Minimal data transfer
- Compressed responses
- Efficient JSON serialization

## Testing

### Unit Tests
- Checkout form validation
- Delivery method calculation
- Payment method validation
- Order creation logic



### Performance Tests
- Checkout response times
- Concurrent checkout handling
- Database performance under load
- Cache effectiveness

## Monitoring and Logging

### Checkout Metrics
- Checkout completion rates
- Abandoned cart rates
- Average checkout time
- Error frequency by step

### Logging
- All checkout attempts logged
- Error details captured
- User behavior tracking
- Performance metrics logging

### Alerts
- High error rate notifications
- Payment processing failures
- Delivery method unavailability
- System performance degradation
