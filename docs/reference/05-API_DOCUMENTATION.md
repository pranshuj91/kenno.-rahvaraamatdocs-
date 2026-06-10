id: API_DOCUMENTATION
title: API DOCUMENTATION
# API Documentation

## Overview
📘 STACC API Documentation (v1.0)

Base URL: http://localhost:8081/stacc

🔹 1. GET /client-account
📄 Description:
Retrieves the collection of client accounts.

🧾 Parameters:
- createdFrom (string, query) — Format: php:Y-m-d H:i:s
- createdTo (string, query) — Format: php:Y-m-d H:i:s
- page (integer, query)

📤 Response 200: Client account collection response
Example Schema:
```json
{
  "client": "string",
  "gender": "string",
  "birthday": "2025-07-28T15:15:40.899Z",
  "created": "2025-07-28T15:15:40.899Z",
  "preferences": [
    "string"
  ]
}
```

🔹 2. GET /product
📄 Description:
Retrieves the collection of products.

🧾 Parameters:
- page (integer, query)

📤 Response 200: Product collection response
Example Schema:
```json
{
  "code": "string",
  "type": "string",
  "language": "string",
  "name": "string",
  "price": 0,
  "discountPrice": 0,
  "isDiscountedProduct": true,
  "description": "string",
  "stockCount": 0,
  "imageUrl": "string",
  "createdAt": "2025-07-28T15:16:06.279Z",
  "updatedAt": "2025-07-28T15:16:06.279Z",
  "categories": [
    {
      "category": {
        "code": "string",
        "level": "string",
        "name": "string",
        "webStore": "string"
      },
      "parent": {
        "code": "string",
        "level": "string",
        "name": "string",
        "webStore": "string"
      },
      "root": {
        "code": "string",
        "level": "string",
        "name": "string",
        "webStore": "string"
      }
    }
  ],
  "authors": [
    {
      "name": "string",
      "code": "string"
    }
  ],
  "publisher": {
    "name": "string",
    "code": "string"
  },
  "webStores": [
    "string"
  ],
  "physicalBook": "string"
}
```

🔹 3. GET /sales-history
📄 Description:
Retrieves the collection of sales/orders history.

🧾 Parameters:
- createdFrom (string, query) — Format: php:Y-m-d H:i:s
- createdTo (string, query) — Format: php:Y-m-d H:i:s
- page (integer, query)

📤 Response 200: Sales history collection response
Example Schema:
```json
{
  "order": "string",
  "client": "string",
  "clientType": "string",
  "createdAt": "2025-07-28T15:16:34.914Z",
  "createdNav": "2025-07-28T15:16:34.914Z",
  "sourceType": "string",
  "products": [
    "string"
  ],
  "city": "string",
  "session": "string",
  "deliveryMethod": "string",
  "shop": "string"
}
```

🔹 4. GET /session
📄 Description:
Retrieves the collection of session actions.

🧾 Parameters:
- page (integer, query)

📤 Response 200: Session actions collection response
Example Schema:
```json
{
  "session": "string",
  "webStore": "string",
  "product": "string",
  "client": "string",
  "actionType": "string",
  "createdAt": "2025-07-28T15:16:52.056Z"
}
```

🔹 5. GET /shop
📄 Description:
Retrieves the collection of shops.

🧾 Parameters:
- page (integer, query)

📤 Response 200: Shop collection response
Example Schema:
```json
{
  "code": "string",
  "name": "string",
  "city": "string"
}
```

✅ Schemas Used:
- Category
- ClientAccount
- Product
- SalesHistory
- SessionAction
- Shop



# STACC API - Schemas Documentation

This document defines the data schemas used across STACC API endpoints.


## Schema: Category

- `code`: string  
- `level`: string  
- `name`: string  
- `webStore`: string  


## Schema: ClientAccount

- `client`: string  
- `gender`: string  
- `birthday`: string (date-time)  
- `created`: string (date-time)  
- `preferences`: array of string  


## Schema: Product

- `code`: string  
- `type`: string  
- `language`: string (nullable)  
- `name`: string  
- `price`: number  
- `discountPrice`: number  
- `isDiscountedProduct`: boolean  
- `description`: string (nullable)  
- `stockCount`: integer  
- `imageUrl`: string (nullable)  
- `createdAt`: string (date-time)  
- `updatedAt`: string (date-time)  
- `categories`: array of objects  
  - `category`: [Category](#schema-category)  
  - `parent`: [Category](#schema-category)  
  - `root`: [Category](#schema-category)  
- `authors`: array of objects  
  - `name`: string  
  - `code`: string  
- `publisher`: object (nullable)  
  - `name`: string  
  - `code`: string  
- `webStores`: array of string  
- `physicalBook`: string (nullable)  
  - *Physical book code. Will be filled for e-books that have physical format.*  


## Schema: SalesHistory

- `order`: string  
  - *Order code*  
- `client`: string  
  - *Client code*  
- `clientType`: string  
  - *Values: PYSIKLIENT, ETTEVOTE*  
- `createdAt`: string (date-time)  
  - *Date and time when the order was received from the ERP.*  
- `createdNav`: string (date-time)  
  - *Date and time of the order creation (may appear later after ERP handling)*  
- `sourceType`: string  
  - *Values: ONLINE or OFFLINE*  
- `products`: array  
- `city`: string  
- `session`: string (nullable)  
- `deliveryMethod`: string  
- `shop`: string (nullable)  


## Schema: SessionAction

- `session`: string  
- `webStore`: string  
- `product`: string  
- `client`: string  
  - *Client code*  
- `actionType`: string  
  - *Values: VIEW, ADD_TO_WISHLIST, ADD_TO_BASKET*  
- `createdAt`: string (date-time)  


## Schema: Shop

- `code`: string  
- `name`: string  
- `city`: string  

📌 Note:
This documentation is auto-generated from Swagger running at:
http://localhost:8081/stacc/swagger/api-docs
