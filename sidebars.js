// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'reference/PROJECT_OVERVIEW',
      label: 'Project Overview',
    },

    // ---------- First-time setup ----------
    {
      type: 'category',
      label: '1. Getting Started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'setup-guide/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'setup-guide/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'setup-guide/ONBOARDING',
          label: 'Onboarding Pack',
        },
        {
          type: 'doc',
          id: 'setup-guide/LOCAL_SETUP',
          label: 'Local Setup Roadmap',
        },
        {
          type: 'doc',
          id: 'setup-guide/DOCKER_SETUP',
          label: 'Docker Setup',
        },
        {
          type: 'doc',
          id: 'core/STRUCTURE',
          label: 'Project Structure',
        },
        {
          type: 'doc',
          id: 'setup-guide/ENVIRONMENT_SETUP',
          label: 'Environment Setup',
        },
        {
          type: 'doc',
          id: 'setup-guide/DATABASE_SCHEMA',
          label: 'Database Schema',
        },
        {
          type: 'doc',
          id: 'reference/CONFIGURATION_FILES',
          label: 'Configuration Files',
        },
        {
          type: 'doc',
          id: 'reference/CONFIGURATION',
          label: 'Configuration Reference',
        },
        {
          type: 'doc',
          id: 'setup-guide/MIGRATION',
          label: 'Migration Guide',
        },
        {
          type: 'doc',
          id: 'setup-guide/LEGACY_INSTALLATION',
          label: 'Legacy Installation',
        },
      ],
    },

    // ---------- Auth ----------
    {
      type: 'category',
      label: '2. Authentication',
      link: {
        type: 'doc',
        id: 'authentication/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'authentication/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'authentication/AUTHENTICATION_AUTHORIZATION',
          label: 'Auth & Authorization',
        },
        {
          type: 'doc',
          id: 'authentication/REGISTRATION_FLOW',
          label: 'Registration Flow',
        },
        {
          type: 'doc',
          id: 'core/CORE_MODELS',
          label: 'Login Flow / Core Models',
        },
      ],
    },

    // ---------- Commerce ----------
    {
      type: 'category',
      label: '3. Commerce & Ordering',
      link: {
        type: 'doc',
        id: 'commerce-ordering/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'commerce-ordering/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'Orders & Checkout',
          items: [
            {
              type: 'doc',
              id: 'commerce-ordering/ecommerce-integration-guide',
              label: 'Ecommerce Integration Guide',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/order-purchase-flow',
              label: 'Order Purchase Flow',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/order-placement',
              label: 'Order Management',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/order-handling-by-client-type',
              label: 'Order Handling by Client Type',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/basket-management',
              label: 'Basket Management',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/checkout-process',
              label: 'Checkout Process',
            },
          ],
        },
        {
          type: 'category',
          label: 'Payments',
          items: [
            {
              type: 'doc',
              id: 'commerce-ordering/payment-system',
              label: 'Payment System',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/payment-overview',
              label: 'Payment Overview',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/payment-integration',
              label: 'Payment Integration',
            },
          ],
        },
        {
          type: 'category',
          label: 'Catalog & Pricing',
          items: [
            {
              type: 'doc',
              id: 'commerce-ordering/pricing',
              label: 'Pricing Logic',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/availability',
              label: 'Availability',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/availability-sync',
              label: 'Availability Sync',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/subscription-management',
              label: 'Subscription Management',
            },
            {
              type: 'doc',
              id: 'commerce-ordering/shipping-integration',
              label: 'Shipping Integration',
            },
          ],
        },
      ],
    },

    // ---------- Core platform ----------
    {
      type: 'category',
      label: '4. Core Platform',
      link: {
        type: 'doc',
        id: 'core/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'core/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'core/QUEUE_SYSTEM',
          label: 'Queue System',
        },
        {
          type: 'doc',
          id: 'core/NOTIFICATIONS',
          label: 'Email & SMS Notifications',
        },
      ],
    },

    // ---------- Integrations ----------
    {
      type: 'category',
      label: '5. Integrations',
      link: {
        type: 'doc',
        id: 'integrations/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'integrations/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'integrations/EXTERNAL_INTEGRATIONS',
          label: 'External Product Integrations',
        },
        {
          type: 'doc',
          id: 'integrations/NAV_INTEGRATION',
          label: 'NAV ERP Integration',
        },
        {
          type: 'doc',
          id: 'integrations/INTEGRATION_RECONCILIATION',
          label: 'Integration Reconciliation',
        },
        {
          type: 'doc',
          id: 'integrations/KAFKA_EVENTS',
          label: 'Kafka Events',
        },
        {
          type: 'doc',
          id: 'integrations/ELASTICSEARCH_SPOOL',
          label: 'Elasticsearch Spool',
        },
        {
          type: 'doc',
          id: 'integrations/SEARCH_FUNCTIONALITY',
          label: 'Search Functionality',
        },
        {
          type: 'doc',
          id: 'integrations/ELASTICSEARCH_RELIABILITY_PLAN',
          label: 'Elasticsearch Reliability',
        },
      ],
    },

    // ---------- Admin & API ----------
    {
      type: 'category',
      label: '6. Admin & API',
      link: {
        type: 'doc',
        id: 'reference/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'reference/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'reference/ADMIN_PANEL',
          label: 'Admin Panel Guide',
        },
        {
          type: 'doc',
          id: 'reference/ADMIN_MODULE',
          label: 'Admin Module Overview',
        },
        {
          type: 'doc',
          id: 'reference/API_DOCUMENTATION',
          label: 'API Documentation',
        },
        {
          type: 'doc',
          id: 'reference/API_OVERVIEW',
          label: 'API Overview',
        },
        {
          type: 'doc',
          id: 'reference/CONSOLE_COMMANDS',
          label: 'Console Commands',
        },
        {
          type: 'doc',
          id: 'reference/CONSOLE_COMMANDS_SUMMARY',
          label: 'Console Commands Summary',
        },
        {
          type: 'doc',
          id: 'reference/REDIRECTS',
          label: 'URL Redirects',
        },
        {
          type: 'doc',
          id: 'reference/SITEMAP',
          label: 'Sitemap Generation',
        },
      ],
    },

    // ---------- Infrastructure (production + staging findings) ----------
    {
      type: 'category',
      label: '7. Infrastructure & Production',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'infrastructure/INFRASTRUCTURE_OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'infrastructure/INFRASTRUCTURE_OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'infrastructure/IN-004-WEB-STORE-SSL-SETTINGS',
          label: 'IN-004 Web Store SSL',
        },
        {
          type: 'category',
          label: 'Production',
          items: [
            {
              type: 'doc',
              id: 'infrastructure/IN-005-PRODUCTION-SERVER-ARCHITECTURE',
              label: 'IN-005 Server Architecture',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT',
              label: 'IN-001 SSL Certificates',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-002-PM2-PROCESS-MANAGEMENT',
              label: 'IN-002 PM2 Processes',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-006-MONITORING-ALERTING',
              label: 'IN-006 Monitoring & Alerting',
            },
          ],
        },
        {
          type: 'category',
          label: 'Staging',
          items: [
            {
              type: 'doc',
              id: 'infrastructure/IN-005-STAGING-SERVER-ARCHITECTURE',
              label: 'IN-005 Server Architecture',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-001-SSL-CERTIFICATE-MANAGEMENT-STAGING',
              label: 'IN-001 SSL Certificates',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-002-PM2-PROCESS-MANAGEMENT-STAGING',
              label: 'IN-002 PM2 Processes',
            },
            {
              type: 'doc',
              id: 'infrastructure/IN-006-MONITORING-ALERTING-STAGING',
              label: 'IN-006 Monitoring & Alerting',
            },
          ],
        },
      ],
    },

    // ---------- Deploy ----------
    {
      type: 'category',
      label: '8. Deployment & Testing',
      link: {
        type: 'doc',
        id: 'deployment/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'deployment/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'deployment/DEPLOYMENT_GUIDE',
          label: 'Deployment Guide',
        },
        {
          type: 'doc',
          id: 'deployment/TESTING',
          label: 'Testing',
        },
        {
          type: 'doc',
          id: 'deployment/TESTS_OVERVIEW',
          label: 'Tests Overview',
        },
        {
          type: 'doc',
          id: 'deployment/BACKUPS',
          label: 'Backups',
        },
      ],
    },

    // ---------- Monitoring ----------
    {
      type: 'category',
      label: '9. Monitoring & Operations',
      link: {
        type: 'doc',
        id: 'monitoring/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'monitoring/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'monitoring/MONITORING_LOGGING',
          label: 'Monitoring & Logging',
        },
        {
          type: 'doc',
          id: 'monitoring/LOG_MANAGEMENT',
          label: 'Log Management',
        },
        {
          type: 'doc',
          id: 'monitoring/SECURITY',
          label: 'Security',
        },
        {
          type: 'doc',
          id: 'monitoring/PERFORMANCE',
          label: 'Performance',
        },
        {
          type: 'doc',
          id: 'monitoring/CRON_JOBS',
          label: 'Cron Jobs',
        },
        {
          type: 'doc',
          id: 'monitoring/CLEANUP_JOBS',
          label: 'Cleanup Jobs',
        },
        {
          type: 'doc',
          id: 'monitoring/STATISTICS',
          label: 'Statistics',
        },
      ],
    },

    // ---------- Hotline ----------
    {
      type: 'category',
      label: '10. Hotline & OIDC',
      link: {
        type: 'doc',
        id: 'hotline-and-oidc/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'hotline-and-oidc/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'hotline-and-oidc/Hotline-OIDC-Documentation',
          label: 'Hotline & OIDC Docs',
        },
        {
          type: 'doc',
          id: 'hotline-and-oidc/OIDC_SERVER',
          label: 'OIDC Server',
        },
      ],
    },

    // ---------- FAQ ----------
    {
      type: 'category',
      label: '11. FAQ & Help',
      link: {
        type: 'doc',
        id: 'faq/OVERVIEW',
      },
      items: [
        {
          type: 'doc',
          id: 'faq/OVERVIEW',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'faq/FAQ_TROUBLESHOOTING',
          label: 'FAQ & Troubleshooting',
        },
        {
          type: 'doc',
          id: 'faq/GLOSSARY',
          label: 'Glossary',
        },
        {
          type: 'doc',
          id: 'faq/CONTRIBUTING',
          label: 'Contributing',
        },
        {
          type: 'doc',
          id: 'faq/LICENSE',
          label: 'License',
        },
      ],
    },
  ],
};

module.exports = sidebars;
