---
id: LEGACY_INSTALLATION
title: Legacy Installation (Deprecated)
sidebar_label: Legacy Installation
---
# DEPRECATED, USE README.MD
# - - - - - -
# Rahvaraamat

This document contains instructions for setting up a project

## Requirements

php >= v7.2.0

Elastic Search. [Version used in live environment](https://www.elastic.co/downloads/past-releases/elasticsearch-7-16-2)

mysql Ver10.4.24-MariaDB

## Installation and setup

1. #### Clone the project:
    ```
    git clone git@bitbucket.org:singleton-group/uus-rahvaraamat.git
    ```
   Switch to staging branch

2. #### Initialize local config files
   
    ```
    php init
    ```

   Which environment do you want the application to be initialized in?
   
   [0] Development
   [1] Production
    
   * Type `0` if you are using test environment and press `Enter`.

   Initialize the application under 'Development' environment? [yes|no]
    * Type `yes` and press `Enter`.


3. #### Install packages specified in composer.json

    ```
    composer install
    ```

4. #### Configure configs

    Configure a local database | elastic search


5. #### Merge data from database to elastic search
   
   Import data according to defined mapping:
   ```
    php yii elastic/import
   ```

   Executes spool items pushing to elastica DB:
   ```
    php yii elastic/spool
   ```

