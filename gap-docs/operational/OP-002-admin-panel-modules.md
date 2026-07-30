---
id: OP-002-admin-panel-modules
title: OP-002 — Admin Panel Modules
sidebar_label: OP-002 Admin Panel Modules
---

# OP-002 — Admin Panel Modules

| Field | Value |
|---|---|
| Priority | Operational |
| Category | Operational |
| Gap item | Admin Panel Modules |
| Description | Shop, Content, Settings, Integration management — module overview, permissions |
| Documentation status | Documented |
| Code location | TBD |
| Assigned to | — |

## Source files used

- `docs/reference/06-ADMIN_PANEL.md`
- `docs/reference/ADMIN_MODULE.md`

## Documentation (copied from Developer Docs)

> Content below is taken from existing files under ``docs/``. Nothing invented.


---

### From `docs/reference/06-ADMIN_PANEL.md`

id: ADMIN_PANEL
title: ADMIN PANEL
# Admin Panel Documentation & Guide
# Rahva Raamat Admin Panel – Functional Overview & Translations

This guide explains how to use the **Rahva Raamat eShop Admin System** for managing products, coupons, and more — based on the visible UI structure. It also includes translations from Estonian to English for clarity.

---


## Table of Contents
1. [Admin Panel Overview](#admin-panel-overview)
2. [Menu Structure & Navigation](#menu-structure--navigation)
3. [Product Management](#product-management)
4. [Discount & Coupon Management](#discount--coupon-management)
5. [Order Management](#order-management)
6. [User Management](#user-management)
7. [Content Management](#content-management)
8. [Settings & Configuration](#settings--configuration)
9. [Vendor Management](#vendor-management)
10. [Audio/Subscription Management](#audiosubscription-management)
11. [System Administration](#system-administration)

---

## Admin Panel Overview

The admin panel is built using Yii2 framework with Estonian as the primary language. All interface elements are in Estonian with the following structure:

### Language Translations (Estonian → English)

| Estonian | English |
|----------|---------|
| **Veebipood** | **Web Store** |
| Tooted | Products |
| Tellimused | Orders |
| Toote erinimekirjad | Product Special Lists |
| Kampaaniate loendid | Campaign Lists |
| Kinkekaardid | Gift Cards |
| Allahindluskoodid | Discount Codes |
| Tooteinfo laadimine | Product Info Loading |
| Hulgipakkumised | Wholesale Offers |
| Autorid | Authors |
| Sarjad | Series |
| Kirjastaja | Publisher |
| Tagasi laos teated | Back in Stock Notifications |
| Uudiskirja liitujad | Newsletter Subscribers |

| Estonian | English |
|----------|---------|
| **Kasutajad** | **Users** |
| Kliendid | Customers |
| Ärikliendid | Business Customers |
| Hulgikliendid | Wholesale Customers |
| Kommentaarid | Comments |
| Administraatorid | Administrators |

| Estonian | English |
|----------|---------|
| **Sisuhaldus** | **Content Management** |
| Sisulehed | Content Pages |
| Abi Sisulehed | Help Content Pages |
| Komponendipõhine leht | Component-based Page |
| Teemade eelistused | Topic Preferences |
| Kategooria SEO juhtimine | Category SEO Management |
| Teadaanded | Announcements |
| Sündmused | Events |
| Kirjandusuudised | Literature News |
| Tootemärgid | Product Badges |
| Bännerid | Banners |
| Bänneri rühmad | Banner Groups |
| Header Bänner | Header Banner |
| Ikoonide plokkid | Icon Blocks |
| Ikooni plokkide rühmad | Icon Block Groups |
| Väikesed bännerid | Small Banners |
| Väiksed bänneri rühmad | Small Banner Groups |
| Poed | Stores |
| Logo | Logo |
| Blogi | Blog |
| Blogi tagid | Blog Tags |
| Hero Section | Hero Section |
| KKK | FAQ |
| Kontaktid | Contacts |
| Privaatsustingimused | Privacy Terms |
| Tööpakkumised | Job Offers |
| Kasutustingimused | Terms of Use |

| Estonian | English |
|----------|---------|
| **Üldseaded** | **General Settings** |
| Poe üldseaded | Store General Settings |
| Ips handling | IP Handling |
| Tõlke seaded | Translation Settings |
| E-Maili mallide seaded | Email Template Settings |
| Api ligipääsud | API Access |
| Tarneviiside hinnad | Delivery Method Prices |
| Kohaletoimetamise aktiveerimine | Local Delivery Activation |
| Tarneaja nihe | Delivery Time Offset |
| Puhkus tarneaja nihe | Holiday Delivery Time Offset |
| Stacc kasutajad | Stacc Users |
| Sisselogimise katse | Login Attempt |
| Buroomaailm | Buroomaailm |
| Wolt | Wolt |
| Otsing | Search |
| Tellimisteenus | Order Service |
| Liitumisplaan | Subscription Plan |

---

## Menu Structure & Navigation

### Main Menu Items

#### 1. **Veebipood (Web Store)**
- **Tooted (Products)** - Product catalog management
- **Tellimused (Orders)** - Order processing and management
- **Toote erinimekirjad (Product Special Lists)** - Special product lists
- **Kampaaniate loendid (Campaign Lists)** - Marketing campaign management
- **Kinkekaardid (Gift Cards)** - Gift card management
- **Allahindluskoodid (Discount Codes)** - Discount and coupon management
- **Tooteinfo laadimine (Product Info Loading)** - Product data synchronization
- **Hulgipakkumised (Wholesale Offers)** - Wholesale customer management
- **Autorid (Authors)** - Author information management
- **Sarjad (Series)** - Product series management
- **Kirjastaja (Publisher)** - Publisher information
- **Tagasi laos teated (Back in Stock Notifications)** - Stock notification management
- **Uudiskirja liitujad (Newsletter Subscribers)** - Newsletter subscription management

#### 2. **Kasutajad (Users)**
- **Kasutajad (Users)** - User account management
- **Kliendid (Customers)** - Customer account management
- **Ärikliendid (Business Customers)** - Business customer management
- **Hulgikliendid (Wholesale Customers)** - Wholesale customer management
- **Kommentaarid (Comments)** - Product comment management
- **Administraatorid (Administrators)** - Admin user management

#### 3. **Sisuhaldus (Content Management)**
- **Sisulehed (Content Pages)** - Static page management
- **Abi Sisulehed (Help Content Pages)** - Help page management
- **Komponendipõhine leht (Component-based Page)** - Dynamic page components
- **Teemade eelistused (Topic Preferences)** - Topic preference management
- **Kategooria SEO juhtimine (Category SEO Management)** - SEO optimization
- **Teadaanded (Announcements)** - System announcements
- **Sündmused (Events)** - Event management
- **Kirjandusuudised (Literature News)** - Literature news management
- **Tootemärgid (Product Badges)** - Product badge management
- **Bännerid (Banners)** - Banner management
- **Bänneri rühmad (Banner Groups)** - Banner group management
- **Header Bänner (Header Banner)** - Header banner management
- **Ikoonide plokkid (Icon Blocks)** - Icon block management
- **Ikooni plokkide rühmad (Icon Block Groups)** - Icon block group management
- **Väikesed bännerid (Small Banners)** - Small banner management
- **Väiksed bänneri rühmad (Small Banner Groups)** - Small banner group management
- **Poed (Stores)** - Store management
- **Logo (Logo)** - Logo management
- **Blogi (Blog)** - Blog management
- **Blogi tagid (Blog Tags)** - Blog tag management
- **Hero Section (Hero Section)** - Hero section management
- **KKK (FAQ)** - FAQ management
- **Kontaktid (Contacts)** - Contact information
- **Privaatsustingimused (Privacy Terms)** - Privacy policy
- **Tööpakkumised (Job Offers)** - Job offer management
- **Kasutustingimused (Terms of Use)** - Terms of service

#### 4. **Üldseaded (General Settings)**
- **Poe üldseaded (Store General Settings)** - Store configuration
- **Ips handling (IP Handling)** - IP address management
- **Tõlke seaded (Translation Settings)** - Translation configuration
- **E-Maili mallide seaded (Email Template Settings)** - Email template management
- **Api ligipääsud (API Access)** - API access management
- **Tarneviiside hinnad (Delivery Method Prices)** - Delivery pricing
- **Kohaletoimetamise aktiveerimine (Local Delivery Activation)** - Local delivery setup
- **Tarneaja nihe (Delivery Time Offset)** - Delivery time configuration
- **Puhkus tarneaja nihe (Holiday Delivery Time Offset)** - Holiday delivery settings
- **Stacc kasutajad (Stacc Users)** - Stacc user management
- **Sisselogimise katse (Login Attempt)** - Login attempt management
- **Buroomaailm (Buroomaailm)** - Buroomaailm integration
- **Wolt (Wolt)** - Wolt integration
- **Otsing (Search)** - Search configuration
- **Tellimisteenus (Order Service)** - Order service settings
- **Liitumisplaan (Subscription Plan)** - Subscription plan management

---

## Product Management

### How to Add Products in Admin Panel

#### 1. **Access Product Management**
- Navigate to **Veebipood (Web Store)** → **Tooted (Products)**
- Click **"Lisa uus" (Add New)** button

#### 2. **Product Creation Process**

**Step 1: Basic Information**
```
Pealkiri (Title): Product name
Kood (Code): Product code/SKU
Tüüp (Type): Product type selection
Kirjeldus (Description): Product description
```

**Step 2: Pricing**
```
Hind (Price): Base price
Soodushind (Discount Price): Discounted price
Käibemaks (VAT): Tax rate
```

**Step 3: Inventory**
```
Kogus (Quantity): Stock quantity
Staatus (Status): Active/Inactive
```

**Step 4: Categories**
```
Kategooriad (Categories): Product categorization
```

**Step 5: Images**
```
Pildid (Images): Product image upload
```

#### 3. **Product Types Available**
- **Raamat (Book)** - Physical books
- **E-raamat (E-book)** - Digital books
- **Audiobook** - Audio books
- **Muud tooted (Other Products)** - Miscellaneous items

#### 4. **Product Status Options**
- **Aktiivne (Active)** - Available for purchase
- **Mitteaktiivne (Inactive)** - Not available
- **Ajutiselt laos (Temporarily Out of Stock)** - Out of stock

#### 5. **Product Management Features**
- **Bulk Operations**: Select multiple products for mass actions
- **Export**: Export product data to CSV
- **Search & Filter**: Advanced search and filtering options
- **Image Management**: Multiple image upload and management
- **Related Products**: Link related products
- **SEO Settings**: Meta tags and URL optimization

### How to Edit Products in Admin Panel

#### 1. **Access Product for Editing**
- Navigate to **Veebipood (Web Store)** → **Tooted (Products)**
- Find the product in the list
- Click on the **product name** or **"Muuda" (Edit)** button

#### 2. **Product Edit Form Sections**

**Basic Information Tab:**
```
Pealkiri (Title): Edit product name
Kood (Code): Modify product code/SKU
Tüüp (Type): Change product type
Kirjeldus (Description): Update product description
```

**Pricing Tab:**
```
Hind (Price): Update base price
Soodushind (Discount Price): Modify discounted price
Käibemaks (VAT): Adjust tax rate
```

**Inventory Tab:**
```
Kogus (Quantity): Update stock quantity
Staatus (Status): Change product status
```

**Categories Tab:**
```
Kategooriad (Categories): Add/remove categories
```

**Images Tab:**
```
Pildid (Images): Add/remove product images
Järjestus (Order): Reorder images
```

#### 3. **Advanced Edit Features**

**Product Relationships:**
```
Seotud tooted (Related Products): Link/unlink related products
Alternatiivsed tooted (Alternative Products): Set alternative products
```

**SEO Settings:**
```
Meta pealkiri (Meta Title): SEO title
Meta kirjeldus (Meta Description): SEO description
URL: Custom URL slug
```

**Product Attributes:**
```
Autor (Author): Book author
Kirjastaja (Publisher): Book publisher
ISBN: International Standard Book Number
Lehekülgi (Pages): Number of pages
Keel (Language): Book language
```

#### 4. **Bulk Edit Operations**

**Select Multiple Products:**
1. Check the boxes next to products you want to edit
2. Choose bulk action from dropdown:
   - **Muuda staatus (Change Status)**
   - **Lisa kategooria (Add Category)**
   - **Eemalda kategooria (Remove Category)**
   - **Muuda hind (Change Price)**
   - **Kustuta (Delete)**

**Bulk Status Change:**
```
Aktiivne (Active): Make selected products active
Mitteaktiivne (Inactive): Make selected products inactive
Ajutiselt laos (Temporarily Out of Stock): Mark as out of stock
```

#### 5. **Product Search and Filter for Editing**

**Search Options:**
```
Nimi (Name): Search by product name
Kood (Code): Search by product code
Kategooria (Category): Filter by category
Staatus (Status): Filter by status
Hind (Price): Filter by price range
```

**Advanced Filters:**
```
Tüüp (Type): Filter by product type
Autor (Author): Filter by author
Kirjastaja (Publisher): Filter by publisher
Kuupäev (Date): Filter by creation date
```

#### 6. **Product Edit Actions**

**Save Changes:**
- Click **"Salvesta" (Save)** to save changes
- Click **"Salvesta ja jätka" (Save and Continue)** to save and stay on edit page
- Click **"Salvesta ja lisa uus" (Save and Add New)** to save and create new product

**Cancel Changes:**
- Click **"Tagasi" (Back)** to return without saving
- Click **"Tühista" (Cancel)** to cancel changes

#### 7. **Product Edit Validation**

**Required Fields:**
- **Pealkiri (Title)**: Product name is required
- **Kood (Code)**: Product code must be unique
- **Hind (Price)**: Price must be positive number

**Validation Messages:**
```
"Pealkiri on kohustuslik" (Title is required)
"Kood peab olema unikaalne" (Code must be unique)
"Hind peab olema positiivne arv" (Price must be positive number)
```

#### 8. **Product Edit History**

**Change Tracking:**
- View **"Muudatuste ajalugu" (Change History)** to see previous edits
- Track who made changes and when
- Revert to previous versions if needed

---

## Discount & Coupon Management

### Discount Code Management

#### 1. **Access Discount Management**
- Navigate to **Veebipood (Web Store)** → **Allahindluskoodid (Discount Codes)**

#### 2. **Creating Discount Codes**

**Basic Information:**
```
Pealkiri (Title): Discount code name
Kood (Code): Discount code (e.g., SUMMER2024)
Allahindlus (Discount): Discount amount
Allahindlus tüüp (Discount Type): Percentage or Fixed amount
```

**Validity Settings:**
```
Kehtiv alates (Valid From): Start date
Kehtiv kuni (Valid Until): End date
Kasutuskordi (Usage Count): Maximum usage limit
```

**Target Settings:**
```
Miinimum ostusumma (Minimum Basket Sum): Minimum order value
Kategooriad (Categories): Applicable categories
Tooted (Products): Specific products
```

**User Restrictions:**
```
Saadaval külalisklientidele (Available to Guest Users): Yes/No
Saadaval kliendile (Available to Customer Users): Yes/No
Saadaval ärikliendile (Available to Business Users): Yes/No
```

#### 3. **Discount Code Types**

**Percentage Discount:**
- Discount percentage (e.g., 10%, 20%)
- Applied to total order value

**Fixed Amount Discount:**
- Fixed amount discount (e.g., €5, €10)
- Applied to total order value

**Free Shipping:**
- 100% delivery discount
- Applies to delivery costs only

#### 4. **Discount Code Features**

**Usage Tracking:**
```
Kasutatud (Used): Number of times used
Kasutuskordi (Usage Count): Maximum allowed usage
```

**Restrictions:**
```
Kehtib (Applies to): Specific products/categories
Ei kehti (Does not apply to): Excluded products/categories
```

**Advanced Settings:**
```
Köide (Binding): Product binding type
Tüüp (Type): Product type restrictions
Omniva ja Smartpost 100% soodustus (Omniva and Smartpost 100% discount): Delivery discount
```

#### 5. **How to Add/Edit Coupons Step by Step**

**Step 1: Access Coupon Management**
1. Navigate to **Veebipood (Web Store)** → **Allahindluskoodid (Discount Codes)**
2. Click **"Lisa uus" (Add New)** for new coupon or click on existing coupon name to edit

**Step 2: Fill Basic Information**
```
Pealkiri (Title): Enter coupon name (e.g., "Summer Sale 20%")
Kood (Code): Enter unique coupon code (e.g., SUMMER20)
Allahindlus (Discount): Enter discount amount (e.g., 20)
Allahindlus tüüp (Discount Type): Select "Protsent" (Percentage) or "Summa" (Fixed Amount)
```

**Step 3: Set Validity Period**
```
Kehtiv alates (Valid From): Set start date and time
Kehtiv kuni (Valid Until): Set end date and time
Kasutuskordi (Usage Count): Set maximum usage limit (e.g., 100)
```

**Step 4: Configure Restrictions**
```
Miinimum ostusumma (Minimum Basket Sum): Set minimum order value (e.g., 50€)
Kategooriad (Categories): Select applicable categories
Tooted (Products): Select specific products (optional)
```

**Step 5: Set User Permissions**
```
Saadaval külalisklientidele (Available to Guest Users): Check if guests can use
Saadaval kliendile (Available to Customer Users): Check if customers can use
Saadaval ärikliendile (Available to Business Users): Check if business users can use
```

**Step 6: Advanced Settings**
```
Publitseeritud (Published): Check to make coupon active
Omniva ja Smartpost 100% soodustus (Omniva and Smartpost 100% discount): Check for free shipping
```

**Step 7: Save Coupon**
- Click **"Salvesta" (Save)** to create/edit the coupon
- Click **"Salvesta ja jätka" (Save and Continue)** to save and stay on edit page

#### 6. **Coupon Management Features**

**Bulk Coupon Operations:**
1. Select multiple coupons using checkboxes
2. Choose bulk action:
   - **Aktiveeri (Activate)**: Make selected coupons active
   - **Deaktiveeri (Deactivate)**: Make selected coupons inactive
   - **Kustuta (Delete)**: Delete selected coupons

**Coupon Search and Filter:**
```
Kood (Code): Search by coupon code
Pealkiri (Title): Search by coupon name
Staatus (Status): Filter by active/inactive
Kuupäev (Date): Filter by creation date
```

**Coupon Usage Reports:**
- View **"Kasutuse aruanne" (Usage Report)** to see coupon usage statistics
- Track which customers used which coupons
- Monitor coupon effectiveness

#### 7. **Coupon Validation Rules**

**Required Fields:**
- **Pealkiri (Title)**: Coupon name is required
- **Kood (Code)**: Coupon code must be unique
- **Allahindlus (Discount)**: Discount amount must be positive

**Validation Messages:**
```
"Pealkiri on kohustuslik" (Title is required)
"Kood peab olema unikaalne" (Code must be unique)
"Allahindlus peab olema positiivne arv" (Discount must be positive number)
```

#### 8. **Coupon Types and Examples**

**Percentage Discount Examples:**
```
Kood: SUMMER20
Allahindlus: 20
Tüüp: Protsent (Percentage)
Tulemus: 20% discount on total order
```

**Fixed Amount Examples:**
```
Kood: WELCOME10
Allahindlus: 10
Tüüp: Summa (Fixed Amount)
Tulemus: €10 discount on total order
```

**Free Shipping Examples:**
```
Kood: FREESHIP
Allahindlus: 100
Tüüp: Protsent (Percentage)
Omniva ja Smartpost 100% soodustus: ✓
Tulemus: Free shipping for Omniva and SmartPost
```

#### 9. **Coupon Best Practices**

**Naming Conventions:**
- Use descriptive names: "Summer Sale 20%"
- Use short, memorable codes: "SUMMER20"
- Include date in code if time-limited: "JAN2024"

**Restriction Settings:**
- Set minimum order value to prevent abuse
- Limit usage count for popular coupons
- Use category restrictions for targeted promotions

**Monitoring:**
- Regularly check coupon usage reports
- Monitor coupon effectiveness
- Deactivate expired or underperforming coupons

#### 10. **Gift Card Management**

**Creating Gift Cards:**
```
Kood (Code): Gift card code
Väärtus (Value): Gift card value
Staatus (Status): Active/Inactive
```

**Gift Card Features:**
- Bulk gift card generation
- Gift card balance tracking
- Usage history
- Expiration date management

---

## Order Management

### Order Processing

#### 1. **Access Order Management**
- Navigate to **Veebipood (Web Store)** → **Tellimused (Orders)**

#### 2. **Order Status Management**

**Order Statuses:**
```
Ootel (Pending): New order received
Töötlemisel (Processing): Order being processed
Saadetud (Shipped): Order shipped
Täidetud (Completed): Order completed
Tühistatud (Cancelled): Order cancelled
```

#### 3. **Order Management Features**

**Order Information:**
```
Tellimuse number (Order Number): Unique order ID
Kliendi info (Customer Info): Customer details
Tooted (Products): Ordered products
Summa (Total): Order total
Staatus (Status): Current order status
```

**Order Actions:**
- **Muuda staatus (Change Status)**: Update order status
- **Lisa kommentaar (Add Comment)**: Add internal notes
- **Saada e-mail (Send Email)**: Send customer notifications
- **Prindi (Print)**: Print order details

#### 4. **Order Search & Filtering**

**Search Options:**
```
Tellimuse number (Order Number): Search by order ID
Kliendi e-mail (Customer Email): Search by customer email
Kuupäev (Date): Date range filtering
Staatus (Status): Filter by order status
```

---

## User Management

### Customer Management

#### 1. **Access User Management**
- Navigate to **Kasutajad (Users)** → **Kliendid (Customers)**

#### 2. **Customer Information**

**Customer Details:**
```
E-mail (Email): Customer email address
Nimi (Name): Customer full name
Telefon (Phone): Contact phone number
Aadress (Address): Shipping/billing address
Liik (Type): Customer type (Regular/Business/Wholesale)
```

**Customer Types:**
- **Tavakliendid (Regular Customers)**: Individual customers
- **Ärikliendid (Business Customers)**: Business customers
- **Hulgikliendid (Wholesale Customers)**: Wholesale customers

#### 3. **Customer Management Features**

**Customer Actions:**
- **Vaata tellimusi (View Orders)**: Customer order history
- **Muuda andmeid (Edit Data)**: Update customer information
- **Lisa kommentaar (Add Comment)**: Internal notes
- **Saada e-mail (Send Email)**: Direct communication

#### 4. **Admin User Management**

**Admin User Types:**
```
Administraator (Administrator): Full system access
Müüja (Seller): Limited sales access
Hankija (Vendor): Vendor access
```

**Admin Permissions:**
- **userManagement**: User management access
- **productManagement**: Product management access
- **orderManagement**: Order management access
- **discountCodeManagement**: Discount code management
- **giftCardManagement**: Gift card management

---

## Content Management

### Page Management

#### 1. **Content Pages**
- Navigate to **Sisuhaldus (Content Management)** → **Sisulehed (Content Pages)**

#### 2. **Page Types**

**Static Pages:**
```
Avaleht (Homepage): Main landing page
Kategooria leht (Category Page): Category listing pages
Toote leht (Product Page): Individual product pages
Kontakt leht (Contact Page): Contact information
```

**Dynamic Pages:**
```
Komponendipõhine leht (Component-based Page): Dynamic content pages
Hero Section: Hero banner sections
Bännerid (Banners): Promotional banners
```

#### 3. **SEO Management**

**SEO Settings:**
```
Meta pealkiri (Meta Title): Page title for search engines
Meta kirjeldus (Meta Description): Page description
URL: Custom URL structure
```

#### 4. **Content Components**

**Available Components:**
- **Toote nimekiri (Product List)**: Product listing components
- **Bänner (Banner)**: Promotional banner components
- **Tekst (Text)**: Text content components
- **Pilt (Image)**: Image components
- **Video (Video)**: Video components

---

## Settings & Configuration

### Store Settings

#### 1. **General Store Settings**
- Navigate to **Üldseaded (General Settings)** → **Poe üldseaded (Store General Settings)**

**Store Configuration:**
```
Poe nimi (Store Name): Store display name
E-mail (Email): Contact email
Telefon (Phone): Contact phone
Aadress (Address): Store address
```

#### 2. **Delivery Settings**

**Delivery Methods:**
```
Omniva: Local delivery service
SmartPost: Pickup point delivery
Kohaletoimetamine (Local Delivery): Local area delivery
```

**Delivery Pricing:**
```
Tavaline tarne (Standard Delivery): Standard delivery cost
Kiire tarne (Express Delivery): Express delivery cost
Tasuta tarne (Free Delivery): Free delivery threshold
```

#### 3. **Payment Settings**

**Payment Methods:**
```
Swedbank: Bank payment integration
SEB: Bank payment integration
LHV: Bank payment integration
Coop: Bank payment integration
Luminor: Bank payment integration
```

#### 4. **Email Settings**

**Email Templates:**
```
Tellimuse kinnitus (Order Confirmation): Order confirmation emails
Tarne teade (Shipping Notification): Shipping notifications
Konto loomine (Account Creation): Welcome emails
```

---

## Vendor Management

### Vendor Interface

#### 1. **Vendor Access**
- Navigate to **Hankijaliides (Vendor Interface)**

#### 2. **Vendor Features**

**Product Management:**
```
Tooted (Products): Vendor's product catalog
Lisa toode (Add Product): Add new products
Muuda toodet (Edit Product): Update product information
```

**Order Management:**
```
Tellimused (Orders): View vendor orders
Staatus (Status): Order status tracking
```

**Statistics:**
```
Statistika (Statistics): Sales and performance metrics
Aruanded (Reports): Detailed reports
```

#### 3. **Vendor User Management**

**User Types:**
```
Hankija administraator (Vendor Administrator): Full vendor access
Hankija kasutaja (Vendor User): Limited vendor access
```

---

## Audio/Subscription Management

### Audio Book Management

#### 1. **Audio Module**
- Navigate to **Audio** → **Tooted (Products)**

#### 2. **Audio Book Features**

**Audio Book Information:**
```
Pealkiri (Title): Book title
Autor (Author): Book author
Lugeja (Reader): Audio book narrator
Kestus (Duration): Audio book length
Fail (File): Audio file upload
```

**Subscription Management:**
```
Liitumisplaan (Subscription Plan): Subscription options
Krediit (Credit): Credit-based access
Piiramata (Unlimited): Unlimited access
```

#### 3. **Subscription Features**

**Plan Types:**
```
Kuu (Monthly): Monthly subscription
Aasta (Yearly): Annual subscription
Krediit (Credit): Credit-based access
```

**Usage Tracking:**
```
Kuulatu aeg (Listening Time): Time spent listening
Laenutatud (Borrowed): Borrowed books
Tagastatud (Returned): Returned books
```

---

## System Administration

### System Monitoring

#### 1. **Debug Module**
- Navigate to **Debug moodul (Debug Module)**

**Debug Features:**
```
Tellimused (Orders): Order debugging
Meilivärskenduste konfliktid (Email Update Conflicts): Email conflict resolution
NAV logi (NAV Log): NAV system logs
Süsteemilogi (System Log): System logs
```

#### 2. **System State**

**System Monitoring:**
```
Süsteemi olek (System State): Current system status
Jõudlus (Performance): System performance metrics
Vigade logi (Error Log): Error tracking
```

#### 3. **URL Redirect Management**

**Redirect Features:**
```
URL-i suunamine (URL Redirect): URL redirection management
URL-i suunamine logid (URL Redirect Logs): Redirect tracking
Kategooria Slugid (Category Slugs): Category URL management
```

---

## Common Actions & Buttons

### Action Buttons (Estonian → English)

| Estonian | English | Function |
|----------|---------|----------|
| **Lisa uus** | **Add New** | Create new record |
| **Salvesta** | **Save** | Save changes |
| **Muuda** | **Edit** | Edit record |
| **Kustuta** | **Delete** | Delete record |
| **Tagasi** | **Back** | Return to previous page |
| **Otsi** | **Search** | Perform search |
| **Filtreeri** | **Filter** | Apply filters |
| **Ekspordi** | **Export** | Export data |
| **Impordi** | **Import** | Import data |
| **Aktiveeri** | **Activate** | Activate record |
| **Deaktiveeri** | **Deactivate** | Deactivate record |
| **Kinnita** | **Confirm** | Confirm action |
| **Tühista** | **Cancel** | Cancel action |
| **Jah** | **Yes** | Confirm |
| **Ei** | **No** | Decline |

### Status Indicators

| Estonian | English | Meaning |
|----------|---------|---------|
| **Aktiivne** | **Active** | Record is active |
| **Mitteaktiivne** | **Inactive** | Record is inactive |
| **Ootel** | **Pending** | Awaiting action |
| **Töötlemisel** | **Processing** | Currently being processed |
| **Lõpetatud** | **Completed** | Process completed |
| **Tühistatud** | **Cancelled** | Process cancelled |
| **Viga** | **Error** | Error occurred |

### Form Labels

| Estonian | English |
|----------|---------|
| **Pealkiri** | **Title** |
| **Kirjeldus** | **Description** |
| **Hind** | **Price** |
| **Kogus** | **Quantity** |
| **Staatus** | **Status** |
| **Kuupäev** | **Date** |
| **Aeg** | **Time** |
| **E-mail** | **Email** |
| **Telefon** | **Phone** |
| **Aadress** | **Address** |
| **Nimi** | **Name** |
| **Kood** | **Code** |
| **Tüüp** | **Type** |
| **Kategooria** | **Category** |
| **Pilt** | **Image** |
| **Fail** | **File** |

---

## Technical Implementation

### File Structure

```
admin/
├── controllers/          # Admin controllers
├── models/              # Admin models
├── views/               # Admin views
├── modules/             # Admin modules
│   ├── shop/           # E-commerce module
│   ├── content/        # Content management
│   ├── setting/        # Settings module
│   ├── vendor/         # Vendor management
│   ├── audio/          # Audio book management
│   └── debug/          # Debug module
├── components/          # Reusable components
├── widgets/            # Custom widgets
└── assets/             # Static assets
```

### Key Controllers

- **AdminController**: User management
- **ProductController**: Product management
- **OrderController**: Order processing
- **VoucherDiscountCodeController**: Discount management
- **VoucherGiftCardController**: Gift card management
- **ClientAccountController**: Customer management
- **ContentController**: Content management

### Database Tables

- **product**: Product information
- **order**: Order data
- **user**: User accounts
- **voucher_discount_code**: Discount codes
- **voucher_gift_card**: Gift cards
- **category**: Product categories
- **content_page**: Content pages

---

## Security & Permissions

### User Roles

1. **Administraator (Administrator)**
   - Full system access
   - User management
   - System configuration

2. **Müüja (Seller)**
   - Order management
   - Customer service
   - Limited product access

3. **Hankija (Vendor)**
   - Product management
   - Order viewing
   - Statistics access

### Permission System

- **userManagement**: User account management
- **productManagement**: Product catalog management
- **orderManagement**: Order processing
- **discountCodeManagement**: Discount code management
- **giftCardManagement**: Gift card management
- **contentManagement**: Content management
- **settingManagement**: System settings

---

This comprehensive guide covers all aspects of the Estonian e-commerce admin panel, providing English translations and detailed instructions for all major features and functionalities.


---

### From `docs/reference/ADMIN_MODULE.md`

# Admin module — detailed overview

This document describes the back‑office (admin) application: its structure, main modules, typical workflows, and how it interacts with the shared domain (common/) and background processes.

Scope and goals
- Help developers and operators find features quickly in admin code.
- Explain how the admin UI manipulates catalog, orders, customers, content, audio/e‑books, and settings.
- Point to related processes (sync, spoolers, console jobs) that reflect admin changes to external systems.


## Architecture at a glance
- Entry point: admin web application (Yii2) with its own module namespace under admin/modules/*.
- Each business area is packaged as a Yii Module with its own controllers, models (admin‑side forms, search models), views, and assets.
- Domain entities and business logic live in common/ (ActiveRecord models, services). Admin primarily orchestrates those.
- RBAC/authorization, widgets, and shared components are registered in admin app config (see admin/config/*).

Directory conventions (high level)
- admin/modules/`<feature>`/
  - controllers/ — HTTP controllers for admin routes
  - models/ — form models, search models, DTOs specific to admin
  - views/ — view templates used by controllers
  - assets/ — optional feature‑specific assets
  - Module.php — feature module class registering routes and labels


## Authentication and authorization
- Admin authentication is handled by the Yii user component configured for the admin app.
- Authorization is primarily role/permission based (RBAC). Controllers typically extend a BaseController with access control. Sensitive actions (publishing, deletions, price changes) require specific permissions.
- Multi‑web‑store context: many actions operate in the context of a particular WebStore (see common/models/WebStore). Admin UIs reflect and/or switch context when applicable.


## Major feature modules and what they do
Below is a non‑exhaustive but practical map of important modules under admin/modules. File paths indicate where to look. Controller names convey available CRUD and tools.

- Shop (admin/modules/shop)
  - Purpose: Back‑office for commerce operations: products, orders, customers, sync tools.
  - Notable views: views/sync/* include NAV sync helpers (upload/trigger pages), views/order/* search and detail pages.
  - Ties to console: UIs may invoke or monitor SyncController handlers (php yii sync/*). Refer to common/synchronizations/* for the actual jobs.
  - Related domain: common/models/Product, Order, ClientAccount, Category, Price, Availability.

- Content (admin/modules/content)
  - Purpose: Content management for marketing pages, events, banners, and editorial content.
  - Draft workflow helpers: drafts/EventDraftService.php and similar utilities.
  - Analytics/CTR: Works together with Banner/BannerStat and SmallBanner/SmallBannerStat (see console/controllers/CtrController for nightly CTR aggregation).

~~- Audio (admin/modules/audio)~~ **(DEPRECATED)**

~~- E‑Book (admin/modules/ebook)~~ **(DEPRECATED)**
- 
- Redirects (admin/modules/redirect)
  - Purpose: Manage manual external URL redirects.
  - Notable models: ManualExternalUrlRedirectStorage, ExternalUrlRedirectSearch (search/filtering).

- Settings (admin/modules/setting)
  - Purpose: Global and per‑feature settings surfaces (e.g., shop IP allows/blocks, feature flags, templates).
  - Example: views/ip/* provides management of allowed IPs for admin features.

- Vendor (admin/modules/vendor)
  - Purpose: Tools for vendor relations and data hygiene related to suppliers.

- C~~ombo (admin/modules/combo)~~ (DEPRECATED)

- ~~STACC (admin/modules/stacc)~~ (DEPRECATED)
  - Purpose: STACC‑related integrations and ops surfaces (e.g., personalization feeds or analytics if present).

- Debug (admin/modules/debug)
  - Purpose: Embedded diagnostics and log viewing during development or operations.

Note: The exact set of modules may vary by deployment. Some modules may be experimental or deprecated. See the repository for the current list.


## Typical admin workflows and their system effects
- Product management
  - Create/edit products; attach images, categories, people, and metadata.
  - Changing availability/status/stock directly is uncommon; stock and availability are computed by NAV sync jobs. Manual overrides exist for special cases.
  - Effects: Changes spool to product spoolers which reindex search, update caches, and propagate to storefronts.

- Order management
  - View orders, statuses, payment info, and customer shipping/billing data.
  - Admin does not charge cards directly; payments flow via API + bank. However, admins can see and troubleshoot failed or pending payments.
  - Effects: Some actions may trigger post‑purchase handlers (emails, postbacks). For totals reconciliation, periodic NAV OrderSync aligns numbers.

- Customer accounts
  - Manage client accounts, link companies, reset or assist with access issues.
  - Effects: Touches common/models/User, ClientAccount and can influence API authentication contexts.

- Marketing and content
  - Manage banners, small banners, landing pages, and event drafts.
  - Effects: CTR nightly/periodic jobs aggregate stats and roll up to entities via console CtrController.

- Digital audio/e‑books handling
  - For audiobooks: upload chapters, validate processing, manage availability and previews.
  - Admin actions often queue background work handled by console AudioController (compute durations, file sizes, previews).
  - For e‑books: reporting and operations; availability derives from file presence and sync logic.

- Synchronization tools
  - Admin contains helper pages to inspect and trigger import/sync state for NAV and external suppliers (views under shop/sync/*).
  - Effects: Actual synchronization runs via console (php yii sync/*), guarded by AlreadyRunningFilter. See AvailabilitySync and OrderSync docs.


## Data flow with the common layer and background jobs
- Admin invokes persistence through common ActiveRecord models, validators, and services.
- Many changes write to tables that are later consumed by background jobs or spoolers (e.g., product_spooler_commit) to update secondary systems like Elasticsearch.
- Sync jobs (AvailabilitySync, OrderSync, price imports, image sync) are owned by console/common and merely surfaced for operators in admin.


## Operations and troubleshooting
- Logs: Admin actions log to rr_log. Old logs can be archived using console/controllers/ArchiveController::actionLogs.
- Concurrency guards: Background jobs initiated from admin links or buttons are protected with AlreadyRunningFilter to avoid overlap.
- Health signals: Some admin pages may surface last run timestamps (e.g., lastOrderProcess via system state repository).


## Extending admin
- Create a new module under admin/modules/`<yourModule>` with a Module class extending yii\base\Module.
- Register routes and menu entries in the admin layout/config.
- Place controllers and views following Yii conventions. Use form models for validation.
- Reuse common/ domain models and services. Avoid duplicating business logic in admin; prefer to call services from common/.


## See also
- ../core/STRUCTURE.md — high‑level repository structure and execution flows.
- ./CONSOLE_COMMANDS_SUMMARY.md — console controllers and dynamic sync actions.
- ../commerce-ordering/ORDER_PURCHASE_FLOW.md — end‑to‑end purchase pipeline.
- [Availability Sync](/docs/commerce-ordering/availability-sync) and [Availability](/docs/commerce-ordering/availability) — availability computation.
- ./API_OVERVIEW.md and ../authentication/REGISTRATION_FLOW.md — public API and auth/registration flows.


## Notes on deprecated/unused areas
- Some modules or pages might be legacy or disabled in current deployments. If you find modules that are unused (e.g., legacy sync helpers, prototype features), please list them so we can prune the documentation and optionally follow up with code cleanup in a separate change.

