id: GLOSSARY
title: GLOSSARY
# Glossary







# Estonian to English Translations

## Web Store Section

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

## Users Section

| Estonian | English |
|----------|---------|
| **Kasutajad** | **Users** |
| Kliendid | Customers |
| Ärikliendid | Business Customers |
| Hulgikliendid | Wholesale Customers |
| Kommentaarid | Comments |
| Administraatorid | Administrators |

## Content Management Section

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

## General Settings Section

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

## Common Actions

| Estonian | English |
|----------|---------|
| Lisa uus | Add New |
| Salvesta | Save |
| Muuda | Edit |
| Kustuta | Delete |
| Tagasi | Back |
| Otsi | Search |
| Filtreeri | Filter |
| Ekspordi | Export |
| Impordi | Import |
| Aktiveeri | Activate |
| Deaktiveeri | Deactivate |
| Kinnita | Confirm |
| Tühista | Cancel |
| Jah | Yes |
| Ei | No |

## Status Indicators

| Estonian | English |
|----------|---------|
| Aktiivne | Active |
| Mitteaktiivne | Inactive |
| Ootel | Pending |
| Töötlemisel | Processing |
| Lõpetatud | Completed |
| Tühistatud | Cancelled |
| Viga | Error |

## Form Labels

| Estonian | English |
|----------|---------|
| Pealkiri | Title |
| Kirjeldus | Description |
| Hind | Price |
| Kogus | Quantity |
| Staatus | Status |
| Kuupäev | Date |
| Aeg | Time |
| E-mail | Email |
| Telefon | Phone |
| Aadress | Address |
| Nimi | Name |
| Kood | Code |
| Tüüp | Type |
| Kategooria | Category |
| Pilt | Image |
| Fail | File |






















## Project-Specific Terms

### **Business Terms**

#### **Rahvaraamat**
- **Definition**: Estonia's largest bookstore chain and digital content provider
- **Context**: The main business entity that this e-commerce backend serves
- **Usage**: Used throughout the codebase as the primary business identifier

#### **NAV (Microsoft Dynamics)**
- **Definition**: Enterprise Resource Planning (ERP) system from Microsoft
- **Purpose**: Central business management system for inventory, orders, customers, and financial data
- **Integration**: Bidirectional synchronization with the e-commerce platform
- **Sync Frequency**: Every 35 minutes for real-time data updates
- **Key Functions**:
  - Product catalog management
  - Order processing and fulfillment
  - Customer data synchronization
  - Inventory level tracking
  - Financial transaction processing

#### **STACC (Point of Sale)**
- **Definition**: Point-of-sale integration module for physical stores
- **Purpose**: Connects physical retail locations to the e-commerce platform
- **Authentication**: Basic Authentication for store staff
- **Features**:
  - Store inventory management
  - Sales tracking and reporting
  - Product availability synchronization
  - Real-time stock updates

#### **OIDC (OpenID Connect)**
- **Definition**: Authentication protocol for external mobile applications
- **Purpose**: Provides secure authentication for mobile apps
- **Implementation**: OAuth2 server with OpenID Connect extensions
- **Features**:
  - JWT token generation
  - User identity management
  - Mobile app authentication
  - Session management

#### **LCP (License Content Protection)**
- **Definition**: DRM (Digital Rights Management) system for e-books
- **Purpose**: Protects digital content from unauthorized copying
- **Implementation**: EPUB file encryption and license management
- **Features**:
  - E-book encryption
  - License generation and validation
  - User access control
  - Offline reading support

#### **EveryPay**
- **Definition**: Payment gateway for processing online payments
- **Purpose**: Handles credit card and bank transfer payments
- **Integration**: Supports multiple Estonian banks
- **Features**:
  - Credit card processing
  - Open Banking (PSD2) compliance
  - Recurring payment support
  - Webhook notifications

#### **iPizza**
- **Definition**: Estonian banking standard for payment processing
- **Purpose**: Standardized protocol for bank payment integration
- **Banks Supported**:
  - Swedbank
  - SEB
  - LHV
  - Coop
  - Luminor
- **Features**:
  - Secure payment processing
  - Bank authentication
  - Transaction verification

#### **Custobar**
- **Definition**: Analytics and recommendation service
- **Purpose**: Provides product recommendations and customer analytics
- **Integration**: External API for personalized recommendations
- **Features**:
  - Product recommendations
  - Customer behavior tracking
  - Sales analytics
  - Personalization engine

#### **Wowza Media Server**
- **Definition**: Streaming media server for audio content
- **Purpose**: Delivers audiobook streaming services
- **Features**:
  - Audio file streaming
  - Adaptive bitrate streaming
  - Progress tracking
  - Mobile app support

### **Technical Terms**

#### **Web Store Codes**
- **WEB**: Main web store (books, e-books, physical products)
- **WEB2**: Secondary web store (audio books, digital content)
- **WEB3**: Audio-specific store (audiobooks only)
- **WEB4**: E-book specific store (e-books only)
- **ALL**: All stores combined

#### **NAV Codes**
- **WT**: Main web store orders (WT + 7-digit order ID)
- **WN**: Outlet store orders (WN + 7-digit order ID)
- **WA**: Audio app store orders (WA + 7-digit order ID)
- **HUW**: Wholesale orders (HUW + 7-digit order ID)
- **ET**: E-commerce orders
- **GC**: Gift card orders

#### **User Roles**
- **Admin**: System administrators with full access
  - **MASTER**: Super admin with all permissions
  - **ADMIN_PURCHASING_MANAGER**: Product purchasing management
  - **ADMIN_EMPLOYEE**: General admin tasks
  - **ADMIN_SELLER**: Sales and order management
- **Vendor**: Publishers and content creators
  - **AUTHOR**: Book authors and content creators
  - **VENDOR_EMPLOYEE**: Vendor staff members
  - **MASTER_USER**: Vendor account administrators
- **Client**: End customers and business clients
  - **customer**: Individual retail customers
  - **clientCompanyMasterUser**: Business account administrators
  - **clientWholesaleMasterUser**: Wholesale account administrators
  - **companyEmployee**: Business client employees
  - **wholesaleEmployee**: Wholesale client employees

#### **Payment Methods**
- **SWEDBANK**: Swedbank bank payments
- **DANSKE**: Danske Bank payments
- **CITADELE**: Citadele Bank payments
- **LHV**: LHV Bank payments
- **SEB**: SEB Bank payments
- **NORDEA**: Nordea Bank payments
- **COOP**: Coop Bank payments
- **CREDIT_CARD**: Credit/debit card payments
- **BILL**: Invoice/bill payments
- **POS**: Point of sale payments
- **WHOLESALE**: Wholesale payment terms

#### **Order Statuses**
- **PENDING**: Order created, awaiting payment
- **PAID**: Payment received, order confirmed
- **PROCESSING**: Order being prepared for fulfillment
- **SHIPPED**: Order shipped to customer
- **DELIVERED**: Order successfully delivered
- **CANCELLED**: Order cancelled
- **REFUNDED**: Order refunded
- **FAILED**: Order processing failed

#### **Product Types**
- **PHYSICAL**: Physical books and products
- **EBOOK**: Digital e-books (EPUB format)
- **AUDIOBOOK**: Digital audiobooks (MP3 format)
- **SUBSCRIPTION**: Subscription-based access
- **GIFT_CARD**: Digital gift cards

#### **Subscription Types**
- **AUDIO_CREDIT**: Credit-based audiobook access
- **AUDIO_SHELF**: Fixed-size audiobook library
- **EBOOK_SHELF**: Fixed-size e-book library
- **CATEGORY_ACCESS**: Access to specific content categories

#### **Database Tables**
- **`rr_` prefix**: All application tables use this prefix (Rahvaraamat)
- **`__nav_*`**: NAV ERP integration tables
- **`__temp_*`**: Temporary processing tables
- **`__archive_*`**: Archived data tables

#### **Cache Keys**
- **Redis**: Primary caching system
- **File Cache**: Local file-based caching
- **Database Cache**: Query result caching
- **Session Cache**: User session storage

#### **API Endpoints**
- **REST**: Standard RESTful API endpoints
- **GraphQL**: Alternative API for complex queries
- **WebSocket**: Real-time communication
- **Webhook**: External service notifications

#### **Security Terms**
- **JWT**: JSON Web Tokens for API authentication
- **OAuth2**: Authorization framework
- **CSRF**: Cross-Site Request Forgery protection
- **XSS**: Cross-Site Scripting prevention
- **SQL Injection**: Database security protection

#### **File Storage**
- **AWS S3**: Cloud file storage service
- **Public Bucket**: Publicly accessible files
- **Private Bucket**: Secured file storage
- **CDN**: Content Delivery Network

#### **Queue System**
- **Background Jobs**: Asynchronous task processing
- **Job Queue**: Task queue management
- **Worker Processes**: Background job execution
- **Failed Jobs**: Job error handling

#### **Monitoring Terms**
- **Health Check**: System status monitoring
- **Log Rotation**: Log file management
- **Performance Metrics**: System performance tracking
- **Error Tracking**: Application error monitoring

#### **Development Terms**
- **Yii2**: PHP framework used for the application
- **ActiveRecord**: Database ORM pattern
- **Migrations**: Database schema versioning
- **Composer**: PHP dependency management
- **Docker**: Containerization platform

#### **Testing Terms**
- **Unit Tests**: Individual component testing
- **Functional Tests**: Feature testing
- **API Tests**: API endpoint testing
- **Acceptance Tests**: User scenario testing
- **Codeception**: Testing framework

#### **Deployment Terms**
- **CI/CD**: Continuous Integration/Deployment
- **Staging**: Pre-production environment
- **Production**: Live application environment
- **Rollback**: Version reversion process
- **Blue-Green**: Zero-downtime deployment

#### **Business Logic Terms**
- **Basket**: Shopping cart functionality
- **Checkout**: Order completion process
- **Fulfillment**: Order processing and delivery
- **Inventory**: Stock level management
- **Pricing**: Dynamic pricing rules
- **Discounts**: Promotional pricing
- **Loyalty**: Customer reward system
- **Analytics**: Business intelligence data

#### **Integration Terms**
- **Webhook**: External service notifications
- **API Gateway**: API management and routing
- **Rate Limiting**: Request throttling
- **CORS**: Cross-Origin Resource Sharing
- **SSL/TLS**: Secure communication protocols

#### **Data Terms**
- **Elasticsearch**: Search and indexing engine
- **MySQL**: Primary relational database
- **Redis**: In-memory data store
- **Backup**: Data protection and recovery
- **Archive**: Long-term data storage
- **Sync**: Data synchronization processes 
