---
id: availability
title: Availability
sidebar_label: Availability
---
what application tables are updated with the NAV database information: rr_product_availability, rr_product. During the availability sync, we update availability types only for the products that were added manually or imported from the NAV.

how often is the availability update: At every 35th minute past every hour from 9 through 22.

by which parameters are used to determine if the product is (for all product categories, incl. et, eng, ru books):

permanently out of stock

When we sync products from NAV and receive the NAV field [w_item_s].[Sold Out] that is not empty for the product with status TEMPORARILY_OUT_OF_STOCK then we will mark the product as permanently out of stock.

During the availability sync, we will mark products as permanently out of stock if they:

were imported from the NAV, and during the sync, we didn’t receive any quantities.

already have permanently out-of-stock status and quantities are less than the minimum quantity for the product type + language.

temporarily out of stock

During the availability sync, if products have type office equipment and their thumbnail image is empty.

available

During the availability sync, we will mark products as available if their quantities are more than the minimum quantity for the product type + language.

available in shops

coming soon

When we receive a new product for the first time from the NAV during the product sync then we will mark the product as coming soon.

When someone adds the new product from the admin panel and not setting the availability type for it then it will get COMING_SOON status.

COMING_SOON status will not be changed during the availability sync in case a product already has this status and we didn’t receive the stock counters for it and it was added manually.


See also
- ./AVAILABILITY_SYNC.md — detailed description of the AvailabilitySync job and all processing rules.



