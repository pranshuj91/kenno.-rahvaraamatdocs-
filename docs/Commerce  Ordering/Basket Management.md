---
id: basket-management
title: Basket Management
sidebar_label: Basket Management
---

# Basket Management

## Overview

The basket system in Rahvaraamat provides a robust shopping cart experience that allows customers to add products, manage quantities, apply discounts, and prepare for checkout. The system supports both guest and authenticated user baskets with persistent storage and real-time validation.

## Basket Architecture

### Core Components
- **Basket Component**: Main basket management service
- **Basket Storage**: Session and database storage
- **Basket Validation**: Product availability and pricing validation
- **Basket Calculation**: Price, discount, and tax calculations
- **Basket Merging**: Guest to authenticated user basket merging

## Basket Models

### Basket Model
```php
// api/basket/Basket.php
class Basket
{
    public $id;
    public $token;
    public $userId;
    public $webStoreId;
    public $items = [];
    public $discounts = [];
    public $deliveryMethod;
    public $paymentMethod;
    public $createdAt;
    public $updatedAt;
    public $expiresAt;
    
    public function addProduct(Product $product, int $quantity = 1): bool
    public function removeProduct(int $productId): bool
    public function updateQuantity(int $productId, int $quantity): bool
    public function clear(): void
    public function getTotal(): float
    public function getItemCount(): int
}
```

### Basket Item Model
```php
// api/basket/BasketItem.php
class BasketItem
{
    public $id;
    public $basketId;
    public $productId;
    public $product;
    public $quantity;
    public $unitPrice;
    public $totalPrice;
    public $discountAmount;
    public $finalPrice;
    public $addedAt;
    public $updatedAt;
}
```

## Basket API Endpoints

### GET /basket
**Purpose**: Retrieve current basket contents

**Response**:
```json
{
    "basket": {
        "id": "basket_12345",
        "itemCount": 3,
        "subtotal": 89.97,
        "discountAmount": 10.00,
        "deliveryCost": 2.99,
        "total": 82.96,
        "currency": "EUR",
        "items": [...],
        "discounts": [...]
    }
}
```

### POST /basket/add-product
**Purpose**: Add product to basket

**Request**:
```json
{
    "productId": 123,
    "quantity": 2,
    "options": {
        "format": "hardcover",
        "language": "en"
    }
}
```

### PUT /basket/change-quantity
**Purpose**: Update product quantity in basket

### DELETE /basket/remove-product
**Purpose**: Remove product from basket

### POST /basket/add-discount
**Purpose**: Apply discount code to basket

### DELETE /basket/clear
**Purpose**: Clear all items from basket

## Basket Validation

### Product Validation
- **Availability Check**: Product must be available for purchase
- **Stock Validation**: Sufficient stock must be available
- **Restriction Check**: Product must meet purchase restrictions
- **Quantity Limits**: Quantity must be within allowed limits

### Basket Validation
- **Empty Check**: Basket cannot be empty
- **Item Validation**: All items must be valid
- **Minimum Order Value**: Must meet minimum order requirements
- **Maximum Order Value**: Must not exceed maximum limits

## Basket Calculation

### Price Calculation
```php
// api/basket/calculators/BasketCalculator.php
class BasketCalculator
{
    public function calculateBasket(Basket $basket): BasketCalculation
    {
        $calculation = new BasketCalculation();
        
        $calculation->subtotal = $this->calculateSubtotal($basket);
        $calculation->discountAmount = $this->calculateDiscounts($basket);
        $calculation->deliveryCost = $this->calculateDeliveryCost($basket);
        $calculation->taxAmount = $this->calculateTaxes($basket);
        $calculation->total = $this->calculateTotal($calculation);
        
        return $calculation;
    }
}
```

### Discount Types
- **Percentage Discount**: Percentage off total order
- **Fixed Discount**: Fixed amount off order
- **Shipping Discount**: Free or reduced shipping
- **Product Discount**: Specific product discounts

## Basket Storage

### Session Storage
- **Guest Users**: Basket stored in session
- **Temporary Storage**: Session-based persistence
- **Automatic Cleanup**: Session expiration handling

### Database Storage
- **Authenticated Users**: Basket stored in database
- **Persistent Storage**: Long-term basket persistence
- **User Association**: Basket linked to user account

## Basket Merging

### Guest to User Merging
- **Automatic Merge**: When guest user logs in
- **Quantity Combination**: Combine quantities for same products
- **Discount Preservation**: Preserve applied discounts
- **Conflict Resolution**: Handle merge conflicts

## Basket Expiration

### Expiration Management
- **Default Expiration**: 24 hours for guest baskets
- **User Baskets**: Extended expiration for authenticated users
- **Automatic Cleanup**: Remove expired baskets
- **Expiration Extension**: Extend basket lifetime

## Basket Analytics

### Key Metrics
- **Abandonment Rate**: Baskets not converted to orders
- **Average Basket Value**: Mean basket value
- **Conversion Rate**: Baskets converted to orders
- **Basket Size**: Average items per basket

### Performance Monitoring
- **Response Times**: API response performance
- **Error Rates**: Error frequency monitoring
- **Resource Usage**: System resource monitoring
- **Database Performance**: Query performance tracking

## Error Handling

### Common Errors
- **Product Unavailable**: Product no longer available
- **Stock Insufficient**: Insufficient stock
- **Price Changed**: Product price changes
- **Discount Invalid**: Invalid discount codes

### Error Response Format
```json
{
    "success": false,
    "errorCode": "PRODUCT_UNAVAILABLE",
    "errorMessage": "Product is no longer available",
    "details": {...},
    "suggestions": [...]
}
```

## Security Features

### Input Validation
- **Product ID Validation**: Verify product existence
- **Quantity Validation**: Validate quantity ranges
- **Discount Validation**: Verify discount authenticity
- **Permission Checks**: User access validation

### Data Protection
- **Basket Privacy**: Ensure data privacy
- **User Isolation**: Prevent cross-user access
- **Session Security**: Secure session management
- **CSRF Protection**: CSRF attack prevention

## Testing and Development

### Test Scenarios
- **Basket Operations**: Add, remove, update testing
- **Price Calculation**: Discount and total calculations
- **Validation Logic**: Product and basket validation
- **Storage Operations**: Save and load testing

### Development Tools
- **API Testing**: Postman collections
- **Logging**: Comprehensive activity logging
- **Debug Mode**: Enhanced debugging information
- **Performance Monitoring**: Real-time metrics
