---
id: ecommerce-integration-guide
title: Ecommerce Integration Guide
sidebar_label: Ecommerce Integration Guide
---

# Ecommerce Integration Guide

## Overview

This guide provides comprehensive information for integrating with the Rahvaraamat ecommerce platform. It covers all aspects of the integration including authentication, product management, order processing, payment handling, and shipping integration.

## Integration Architecture

### System Components
- **API Gateway**: Central entry point for all API requests
- **Authentication Service**: Handles user authentication and authorization
- **Product Service**: Manages product catalog and inventory
- **Order Service**: Handles order creation and management
- **Payment Service**: Processes payments through various gateways
- **Shipping Service**: Manages delivery and tracking

### Integration Flow
```
Client Application → API Gateway → Authentication → Service Layer → Database → Response
```

## Authentication & Authorization

### API Authentication
All API requests require authentication using one of the following methods:

#### 1. Bearer Token Authentication
```http
Authorization: Bearer YOUR_API_TOKEN
```

#### 2. API Key Authentication
```http
X-API-Key: YOUR_API_KEY
```

### Token Management
- **Access Tokens**: Valid for 1 hour
- **Refresh Tokens**: Valid for 30 days
- **API Keys**: Valid indefinitely (until revoked)

### Scopes and Permissions
- **read:products**: Read product information
- **write:products**: Create/update products
- **read:orders**: Read order information
- **write:orders**: Create/update orders
- **read:customers**: Read customer information
- **write:customers**: Create/update customers

## Product Management

### Product Data Structure
The Product Data Structure contains the following fields:
- **productId**: Unique product identifier (e.g., "PROD-001")
- **name**: Product name (e.g., "Sample Product")
- **description**: Product description
- **price**: Product price (e.g., 29.99)
- **currency**: Price currency (e.g., "EUR")
- **category**: Product category (e.g., "Electronics")
- **brand**: Product brand (e.g., "Sample Brand")
- **sku**: Stock keeping unit (e.g., "SAMPLE-SKU-001")
- **stock**: Available stock quantity (e.g., 100)
- **images**: Array of product image URLs
- **attributes**: Product attributes like color, size, weight

### Product API Endpoints

#### GET /products
Retrieve list of products with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `brand`: Filter by brand
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search term

#### POST /products
Create a new product.

**Request Body Fields:**
- **name**: Product name
- **description**: Product description
- **price**: Product price
- **category**: Product category
- **stock**: Initial stock quantity

#### PUT /products/\{productId\}
Update an existing product.

#### DELETE /products/\{productId\}
Delete a product (soft delete).

## Order Management

### Order Data Structure
The Order Data Structure contains the following fields:
- **orderId**: Unique order identifier (e.g., "ORD-2024-001")
- **customerId**: Customer identifier (e.g., "CUST-001")
- **status**: Order status (e.g., "pending")
- **items**: Array of order items with product details
- **totals**: Order totals including subtotal, tax, shipping, and total
- **shippingAddress**: Customer shipping address
- **createdAt**: Order creation timestamp

### Order API Endpoints

#### GET /orders
Retrieve list of orders.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by order status
- `customerId`: Filter by customer
- `dateFrom`: Filter from date
- `dateTo`: Filter to date

#### POST /orders
Create a new order.

#### GET /orders/\{orderId\}
Retrieve specific order details.

#### PUT /orders/\{orderId\}
Update order status or details.

## Customer Management

### Customer Data Structure
The Customer Data Structure contains the following fields:
- **customerId**: Unique customer identifier (e.g., "CUST-001")
- **email**: Customer email address
- **firstName**: Customer first name
- **lastName**: Customer last name
- **phone**: Customer phone number
- **addresses**: Array of customer addresses
- **preferences**: Customer preferences and settings
- **createdAt**: Customer creation timestamp

### Customer API Endpoints

#### GET /customers
Retrieve list of customers.

#### POST /customers
Create a new customer.

#### GET /customers/\{customerId\}
Retrieve specific customer details.

#### PUT /customers/\{customerId\}
Update customer information.

## Payment Integration

### Payment Methods
The system supports multiple payment methods:
- Credit/Debit Cards (Visa, MasterCard, American Express)
- Bank Transfers (SEPA, local banks)
- Digital Wallets (Apple Pay, Google Pay)
- Buy Now, Pay Later (Klarna, Clearpay)

### Payment Processing
Payment processing follows this flow:
1. **Payment Initiation**: Create payment request
2. **Gateway Communication**: Send to payment gateway
3. **Customer Authentication**: 3D Secure if required
4. **Payment Authorization**: Gateway authorization
5. **Confirmation**: Payment confirmation

### Payment API Endpoints

#### POST /payments
Create a new payment.

**Request Body Fields:**
- **orderId**: Order identifier (e.g., "ORD-2024-001")
- **amount**: Payment amount (e.g., 77.97)
- **currency**: Payment currency (e.g., "EUR")
- **paymentMethod**: Payment method type (e.g., "credit_card")
- **paymentData**: Payment method specific data (card details, etc.)

#### GET /payments/\{paymentId\}
Retrieve payment details.

#### POST /payments/\{paymentId\}/capture
Capture authorized payment.

#### POST /payments/\{paymentId\}/refund
Refund payment.

## Shipping Integration

### Shipping Methods
Available shipping methods:
- **Parcel Terminals**: Omniva, SmartPost, DPD
- **Home Delivery**: Door-to-door delivery
- **Express Delivery**: Same-day or next-day
- **International Shipping**: European and global

### Shipping Calculation
Shipping costs are calculated based on:
- Delivery method
- Package weight and dimensions
- Destination address
- Delivery urgency
- Special handling requirements

### Shipping API Endpoints

#### GET /shipping/methods
Retrieve available shipping methods for an address.

#### POST /shipping/calculate
Calculate shipping cost for specific delivery method.

#### POST /shipping/labels
Generate shipping label for an order.

#### GET /shipping/track/\{trackingNumber\}
Track shipment status.

## Webhook Integration

### Webhook Events
The system sends webhooks for various events:
- **order.created**: New order created
- **order.updated**: Order status updated
- **payment.completed**: Payment completed
- **payment.failed**: Payment failed
- **shipment.created**: Shipping label generated
- **shipment.delivered**: Package delivered

### Webhook Configuration
```json
{
    "url": "https://yourdomain.com/webhooks",
    "events": ["order.created", "payment.completed"],
    "secret": "your-webhook-secret-key"
}
```

### Webhook Security
- **Signature Verification**: HMAC-SHA256 signatures
- **Event Validation**: Validate event types
- **Retry Logic**: Automatic retry for failed deliveries

## Error Handling

### Error Response Format
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": {
            "field": "email",
            "issue": "Invalid email format"
        }
    },
    "timestamp": "2024-01-10T10:00:00Z"
}
```

### Common Error Codes
- **AUTHENTICATION_ERROR**: Invalid credentials
- **AUTHORIZATION_ERROR**: Insufficient permissions
- **VALIDATION_ERROR**: Invalid input data
- **NOT_FOUND**: Resource not found
- **RATE_LIMIT_EXCEEDED**: Too many requests
- **INTERNAL_ERROR**: Server error

### Error Recovery
- **Retry Logic**: Automatic retry for transient errors
- **Exponential Backoff**: Increasing delay between retries
- **Circuit Breaker**: Prevent cascading failures

## Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641816000
```

### Rate Limit Rules
- **Standard API**: 1000 requests per hour
- **Bulk Operations**: 100 requests per hour
- **Webhook Delivery**: 1000 webhooks per hour

### Rate Limit Exceeded
When rate limit is exceeded:
- HTTP 429 status code returned
- Retry-After header indicates when to retry
- Exponential backoff recommended

## Testing and Development

### Test Environment
- **Base URL**: `https://api-test.rahvaraamat.ee`
- **Test Data**: Pre-populated test products and orders
- **Webhook Testing**: Test webhook endpoint available

### Test Credentials
```json
{
    "apiKey": "your-test-api-key",
    "testCard": "4111111111111111",
    "testCustomer": "test@example.com"
}
```

### Testing Tools
- **Postman Collection**: Complete API collection
- **API Documentation**: Interactive API docs
- **Mock Server**: Local development server

## Security Best Practices

### API Security
- **HTTPS Only**: All API calls must use HTTPS
- **Token Rotation**: Regularly rotate API tokens
- **Scope Limitation**: Use minimal required scopes
- **IP Whitelisting**: Restrict API access to known IPs

### Data Protection
- **PII Handling**: Minimize personal data exposure
- **Encryption**: Encrypt sensitive data in transit and at rest
- **Access Logging**: Log all API access for audit
- **Regular Audits**: Conduct security audits

### Compliance
- **GDPR Compliance**: European data protection
- **PCI DSS**: Payment card industry standards
- **SOC 2**: Security and availability controls

## Performance Optimization

### API Performance
- **Response Caching**: Cache frequently requested data
- **Pagination**: Use pagination for large datasets
- **Field Selection**: Request only needed fields
- **Batch Operations**: Use batch endpoints when possible

### Best Practices
- **Connection Reuse**: Reuse HTTP connections
- **Request Batching**: Batch multiple requests
- **Async Processing**: Use async operations for long-running tasks
- **Monitoring**: Monitor API performance metrics

## Monitoring and Analytics

### API Metrics
- **Response Times**: Monitor API response times
- **Success Rates**: Track API success rates
- **Error Rates**: Monitor error frequencies
- **Usage Patterns**: Analyze API usage patterns

### Monitoring Tools
- **Application Logs**: Comprehensive API logging
- **Performance Metrics**: Real-time performance data
- **Alerting**: Automated error notifications
- **Dashboards**: Real-time monitoring dashboards

## Support and Resources

### Documentation
- **API Reference**: Complete API documentation
- **Integration Guides**: Step-by-step integration guides
- **Code Examples**: Sample code in multiple languages
- **Best Practices**: Integration best practices

### Support Channels
- **Technical Support**: Email and phone support
- **Developer Community**: Community forum and discussions
- **Knowledge Base**: Common questions and solutions
- **Training**: Integration training sessions

### Getting Help
- **Documentation**: Start with API documentation
- **Community**: Check community forums
- **Support Ticket**: Create support ticket for complex issues
- **Emergency Contact**: 24/7 emergency support available


