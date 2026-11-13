---
id: DOCKER_SETUP
title: Docker Setup
sidebar_label: Docker Setup
---
### Project setup with Docker

To install the project locally follow the instructions below:

1. Install Docker Desktop.

2. Download MySQL dump file.

3. Move the dump file to the folder `[project root]/docker/mysql/dumps/`.

4. Rename the dump file to `dump.sql`.

5. Run `docker compose build`. (from the docker directory)

6. Run `docker compose up`. (from the docker directory)

7. Wait for mysql to import the dump and output a similar message to the docker console:

```text
12:53:40+00:00 [Note] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/dump.sql
13:01:25+00:00 [Note] [Entrypoint]: Stopping temporary server
13:01:26+00:00 [Note] [Entrypoint]: Temporary server stopped
13:01:26+00:00 [Note] [Entrypoint]: MariaDB init process done. Ready for start up.
```

8. Access application container console and run next commands:
```text
composer install

php yii migrate
```
NOTE: some error might appear during migration execution. It will depends on the dump that is used.
The issues can be solved just by commenting problem parts of the migrations.

9. Access application using http://localhost:8080/admin-panel


See also
- [Local Setup Roadmap](./LOCAL_SETUP.md)
- [Console Commands](../reference/CONSOLE_COMMANDS_SUMMARY.md)
- [Elasticsearch Spool](../integrations/ELASTICSEARCH_SPOOL.md)
- [Payment System](../commerce-ordering/PAYMENT_SYSTEM.md)
- [Order Purchase Flow](../commerce-ordering/ORDER_PURCHASE_FLOW.md)
- [Order Handling by Client Type](../commerce-ordering/ORDER_HANDLING_BY_CLIENT_TYPE.md)
- [Pricing Logic](../commerce-ordering/PRICING.md)
- [Admin Module](../reference/ADMIN_MODULE.md)
- [Registration Flow](../authentication/REGISTRATION_FLOW.md)
- [Hotline & OIDC](../hotline-and-oidc/Hotline-OIDC-Documentation.md)



