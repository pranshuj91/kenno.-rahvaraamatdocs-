---
id: shipping-integration
title: Shipping Integration
sidebar_label: Shipping Integration
---

# Shipping Integration

## Overview

Rahvaraamat provides comprehensive shipping and delivery solutions through integration with multiple shipping providers and carriers. The system supports various delivery methods including parcel terminals, home delivery, express shipping, and international shipping with real-time tracking and automated label generation.

## Shipping Architecture

### Delivery Flow
```
Order → Delivery Method Selection → Shipping Calculation → Label Generation → Carrier Pickup → Tracking → Delivery
```

### Core Components
- **Shipping Providers**: Integration with external shipping services
- **Delivery Calculators**: Real-time shipping cost calculation
- **Label Generators**: Automated shipping label creation
- **Tracking Services**: Real-time shipment tracking
- **Delivery Managers**: Delivery method and pricing management

## Supported Shipping Providers

### 1. Omniva (Estonian Post)
- **Parcel Terminals**: 200+ locations across Estonia
- **Home Delivery**: Door-to-door delivery service
- **Express Delivery**: Next-day delivery options
- **International Shipping**: European and global shipping

**Integration**:
The Omniva Provider offers:
- Omniva shipping calculation logic
- API communication with Omniva
- Response handling and validation
- Label generation capabilities
- Tracking information retrieval

**Key Features:**
- Comprehensive terminal network
- Real-time cost calculation
- Automated label generation
- Live tracking updates

### 2. SmartPost (Itella)
- **Parcel Terminals**: Extensive terminal network
- **Home Delivery**: Flexible delivery scheduling
- **Business Delivery**: Corporate delivery solutions
- **International Shipping**: European shipping network

**Integration**:
The SmartPost Provider offers:
- SmartPost shipping calculation logic
- API communication with SmartPost
- Response handling and validation
- Label generation capabilities
- Tracking information retrieval

**Key Features:**
- Extensive terminal coverage
- Flexible delivery options
- Business solutions
- International shipping

### 3. DPD Estonia
- **Express Delivery**: Same-day and next-day delivery
- **Home Delivery**: Flexible time slot delivery
- **Business Solutions**: Corporate delivery services
- **International Shipping**: European and global network

### 4. Local Delivery Services
- **Shop Delivery**: Delivery from physical stores
- **Local Couriers**: Regional delivery services
- **Same-day Delivery**: Local area same-day service

## Delivery Methods

### 1. Parcel Terminal Delivery
- **Cost**: €2.99 - €4.99
- **Delivery Time**: 1-3 business days
- **Coverage**: Estonia-wide network
- **Features**: 24/7 pickup, SMS notifications

### 2. Home Delivery
- **Cost**: €4.99 - €7.99
- **Delivery Time**: 2-4 business days
- **Coverage**: Estonia-wide coverage
- **Features**: Time slot selection, signature required

### 3. Express Delivery
- **Cost**: €9.99 - €14.99
- **Delivery Time**: Same-day or next-day
- **Coverage**: Major cities and regions
- **Features**: Priority handling, guaranteed delivery

### 4. International Shipping
- **Cost**: €15.99 - €49.99
- **Delivery Time**: 3-10 business days
- **Coverage**: European Union and global
- **Features**: Customs handling, tracking

### 5. Free Delivery
- **Threshold**: Orders over €50
- **Method**: Standard parcel terminal
- **Coverage**: Estonia-wide
- **Conditions**: Valid for most products

## Shipping Calculation

### Delivery Cost Calculation
The Delivery Calculator manages:
- Base cost calculation
- Distance factor calculation
- Weight factor calculation
- Urgency factor calculation
- Total cost computation

**Calculation Factors:**
- Base delivery method cost
- Distance from warehouse
- Package weight and dimensions
- Delivery urgency level
- Special handling requirements

### Delivery Request Model
The Delivery Request contains:
- Delivery method selection
- Shipping and billing addresses
- Package weight and volume
- Delivery type and timing
- Special instructions
- Order value and currency

**Required Information:**
- Delivery method ID
- Complete address details
- Package specifications
- Delivery preferences

### Delivery Response Model
The Delivery Response includes:
- Calculated shipping cost
- Currency information
- Estimated delivery date
- Available time slots
- Tracking number
- Label URL
- Carrier information
- Service level details

## Shipping API Endpoints

### GET /shipping/methods
**Purpose**: Retrieve available shipping methods for an address

**Request Parameters**:
- `address`: Shipping address
- `weight`: Package weight in kg
- `value`: Order value
- `currency`: Order currency

**Response**:
```json
{
    "shippingMethods": [
        {
            "id": 1,
            "name": "Omniva Parcel Terminal",
            "cost": 2.99,
            "currency": "EUR",
            "estimatedDays": "2-3",
            "description": "Pickup from nearest parcel terminal",
            "available": true,
            "carrier": "Omniva"
        },
        {
            "id": 2,
            "name": "Home Delivery",
            "cost": 4.99,
            "currency": "EUR",
            "estimatedDays": "3-4",
            "description": "Door-to-door delivery",
            "available": true,
            "carrier": "Omniva"
        }
    ]
}
```

### POST /shipping/calculate
**Purpose**: Calculate shipping cost for specific delivery method

**Request**:
```json
{
    "deliveryMethodId": 1,
    "shippingAddress": {
        "street": "123 Main St",
        "city": "Tallinn",
        "postcode": "10115",
        "country": "EE"
    },
    "weight": 2.5,
    "value": 29.99,
    "currency": "EUR"
}
```

**Response**:
```json
{
    "cost": 2.99,
    "currency": "EUR",
    "estimatedDeliveryDate": "2024-01-15",
    "availableTimeSlots": [
        "09:00-12:00",
        "12:00-15:00",
        "15:00-18:00"
    ]
}
```

### POST /shipping/label
**Purpose**: Generate shipping label for an order

**Request**:
```json
{
    "orderId": 12345,
    "deliveryMethodId": 1,
    "carrier": "omniva"
}
```

**Response**:
```json
{
    "success": true,
    "labelUrl": "https://api.example.com/labels/12345.pdf",
    "trackingNumber": "EE123456789EE",
    "carrier": "Omniva",
    "estimatedPickup": "2024-01-10T14:00:00Z"
}
```

### GET /shipping/track/\{trackingNumber\}
**Purpose**: Track shipment status

**Response**:
```json
{
    "trackingNumber": "EE123456789EE",
    "status": "in_transit",
    "location": "Tallinn Sorting Center",
    "estimatedDelivery": "2024-01-15",
    "events": [
        {
            "timestamp": "2024-01-10T10:00:00Z",
            "status": "picked_up",
            "location": "Tallinn",
            "description": "Package picked up from sender"
        },
        {
            "timestamp": "2024-01-10T14:00:00Z",
            "status": "in_transit",
            "location": "Tallinn Sorting Center",
            "description": "Package arrived at sorting center"
        }
    ]
}
```

## Shipping Label Generation

### Label Types
- **Thermal Labels**: For thermal printers
- **PDF Labels**: For standard printing
- **ZPL Labels**: For Zebra printers
- **EPL Labels**: For Epson printers

### Label Content
- **Sender Information**: Company details and return address
- **Recipient Information**: Customer name and shipping address
- **Package Details**: Weight, dimensions, and contents
- **Tracking Information**: Barcode and tracking number
- **Carrier Information**: Shipping provider details

### Label Generation Process
The Label Generator manages:
- Label data preparation
- Template selection
- Label rendering
- Output generation

**Process Flow:**
1. Prepare label data
2. Select appropriate template
3. Render label content
4. Generate output format
5. Provide download link

## Delivery Time Calculation

### Base Delivery Times
- **Parcel Terminal**: 1-2 business days
- **Home Delivery**: 2-3 business days
- **Express Delivery**: Same-day or next-day
- **International**: 3-10 business days

### Time Adjustments
- **Processing Time**: 1 business day for order processing
- **Distance Factor**: Additional time for remote locations
- **Holiday Adjustments**: Extended delivery times during holidays
- **Weather Conditions**: Weather-related delays

### Delivery Time Calculation
The Delivery Time Calculator manages:
- Base delivery time calculation
- Processing time addition
- Distance factor calculation
- Holiday adjustments
- Final date estimation

**Calculation Process:**
1. Get base delivery time
2. Add processing time
3. Calculate distance adjustments
4. Apply holiday corrections
5. Generate final estimate

## Shipping Configuration

### Delivery Method Configuration
```json
{
    "deliveryMethods": {
        "1": {
            "name": "Omniva Parcel Terminal",
            "carrier": "omniva",
            "baseCost": 2.99,
            "freeThreshold": 50.00,
            "estimatedDays": [1, 2],
            "availableCountries": ["EE"],
            "maxWeight": 30.0,
            "maxDimensions": [60, 40, 40],
            "active": true
        },
        "2": {
            "name": "Home Delivery",
            "carrier": "omniva",
            "baseCost": 4.99,
            "freeThreshold": 75.00,
            "estimatedDays": [2, 3],
            "availableCountries": ["EE"],
            "maxWeight": 30.0,
            "maxDimensions": [60, 40, 40],
            "active": true
        }
    }
}
```

### Carrier Configuration
```json
{
    "omniva": {
        "name": "Omniva",
        "apiUrl": "https://api.omniva.ee",
        "apiKey": "your-omniva-api-key",
        "testMode": false,
        "webhookUrl": "https://yourdomain.com/shipping/webhook/omniva",
        "labelFormat": "pdf",
        "trackingEnabled": true
    },
    "smartpost": {
        "name": "SmartPost",
        "apiUrl": "https://api.smartpost.ee",
        "apiKey": "your-smartpost-api-key",
        "testMode": false,
        "webhookUrl": "https://yourdomain.com/shipping/webhook/smartpost",
        "labelFormat": "pdf",
        "trackingEnabled": true
    }
}
```

## Shipping Webhooks

### Webhook Endpoints
- **Shipment Created**: When shipping label is generated
- **Shipment Picked Up**: When carrier picks up package
- **Shipment In Transit**: When package is in transit
- **Shipment Delivered**: When package is delivered
- **Shipment Exception**: When delivery issues occur

### Webhook Processing
The Shipping Webhook Processor manages:
- Webhook signature validation
- Shipment status updates
- Customer notifications
- Error handling

**Processing Flow:**
1. Receive webhook data
2. Validate signature
3. Update shipment status
4. Notify customers
5. Handle errors

## International Shipping

### Customs Documentation
- **Commercial Invoice**: Required for international shipments
- **Packing List**: Detailed package contents
- **Certificate of Origin**: For preferential trade agreements
- **Export License**: For restricted goods

### International Restrictions
- **Prohibited Items**: Items not allowed for international shipping
- **Restricted Items**: Items requiring special permits
- **Value Limits**: Maximum declared value limits
- **Weight Limits**: Maximum package weight limits

### International Shipping Process
The International Shipping Processor manages:
- Customs document generation
- International label creation
- Tracking number generation
- Cost calculation

**Process Flow:**
1. Generate customs documents
2. Create international labels
3. Generate tracking numbers
4. Calculate shipping costs
5. Handle documentation

## Shipping Analytics

### Key Metrics
- **Delivery Success Rate**: Percentage of successful deliveries
- **Average Delivery Time**: Mean time from order to delivery
- **Shipping Cost Analysis**: Shipping cost trends and patterns
- **Carrier Performance**: Performance comparison between carriers

### Performance Monitoring
- **Delivery Time Tracking**: Real-time delivery time monitoring
- **Exception Tracking**: Delivery issue monitoring and resolution
- **Customer Satisfaction**: Delivery experience feedback
- **Cost Optimization**: Shipping cost optimization opportunities

### Reporting
- **Daily Shipping Reports**: Daily shipping activity summaries
- **Monthly Analytics**: Monthly shipping performance analysis
- **Carrier Reports**: Individual carrier performance reports
- **Cost Analysis**: Shipping cost analysis and optimization

## Error Handling

### Common Shipping Issues
- **Address Validation Errors**: Invalid or incomplete addresses
- **Weight/Dimension Limits**: Package exceeds carrier limits
- **Service Unavailability**: Service not available for location
- **Label Generation Failures**: Technical issues with label creation

### Error Response Format
```json
{
    "success": false,
    "errorCode": "ADDRESS_VALIDATION_ERROR",
    "errorMessage": "Invalid shipping address",
    "details": {
        "field": "postcode",
        "issue": "Invalid postcode format for Estonia"
    },
    "suggestions": [
        "Check postcode format (should be 5 digits)",
        "Verify city and postcode match"
    ]
}
```

## Testing and Development

### Test Environment
- **Sandbox APIs**: Test versions of carrier APIs
- **Test Data**: Sample addresses and packages
- **Mock Responses**: Simulated carrier responses
- **Error Simulation**: Simulated error scenarios

### Test Scenarios
- **Successful Shipping**: Test complete shipping flow
- **Address Validation**: Test address validation logic
- **Cost Calculation**: Test shipping cost calculation
- **Label Generation**: Test label generation process
- **Tracking Updates**: Test shipment tracking updates

### Development Tools
- **API Testing**: Postman collections for testing
- **Logging**: Comprehensive shipping activity logging
- **Debug Mode**: Enhanced debugging information
- **Performance Monitoring**: Shipping performance metrics

## Troubleshooting

### Common Issues
- **API Connection Failures**: Check API credentials and connectivity
- **Label Generation Errors**: Verify label template configuration
- **Tracking Update Delays**: Check webhook configuration
- **Cost Calculation Errors**: Verify pricing configuration

### Debug Tools
- **Shipping Logs**: Detailed shipping activity logs
- **API Logs**: External API communication logs
- **Error Reports**: Comprehensive error reporting
- **Performance Metrics**: Shipping performance monitoring

### Support Resources
- **Carrier Documentation**: External carrier API documentation
- **Technical Support**: Internal technical support team
- **Community Forum**: Developer community support
- **Knowledge Base**: Common issues and solutions
