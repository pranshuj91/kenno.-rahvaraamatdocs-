// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro', // from docs/Intro.md
    },
    {
      type: 'category',
      label: 'Setup Guide',
      items: [
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
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        {
          type: 'doc',
          id: 'authentication/AUTHENTICATION_AUTHORIZATION',
          label: 'Authentication Authorization',
        },
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        {
          type: 'doc',
          id: 'deployment/TESTING',
          label: 'Testing',
        },
        {
          type: 'doc',
          id: 'deployment/DEPLOYMENT_GUIDE',
          label: 'Deployment Guide',
        },
      ],
    },
    {
      type: 'category',
      label: 'Monitoring',
      items: [
        {
          type: 'doc',
          id: 'monitoring/MONITORING_LOGGING',
          label: 'Monitoring Logging',
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
      ],
    },
    {
      type: 'category',
      label: 'Core',
      items: [
        {
          type: 'doc',
          id: 'core/CORE_MODELS',
          label: 'Core Models',
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        {
          type: 'doc',
          id: 'reference/PROJECT_OVERVIEW',
          label: 'Project Overview',
        },
        {
          type: 'doc',
          id: 'reference/API_DOCUMENTATION',
          label: 'API Documentation',
        },
        {
          type: 'doc',
          id: 'reference/ADMIN_PANEL',
          label: 'Admin Panel',
        },
        {
          type: 'doc',
          id: 'reference/CONSOLE_COMMANDS',
          label: 'Console Commands',
        },
        {
          type: 'doc',
          id: 'reference/CONFIGURATION',
          label: 'Configuration',
        },
      ],
    },
    {
      type: 'category',
      label: 'FAQ',
      items: [
        {
          type: 'doc',
          id: 'faq/FAQ_TROUBLESHOOTING',
          label: 'FAQ Troubleshooting',
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
      ],
    },
    {
      type: 'category',
      label: 'Commerce / Ordering',
      items: [
        {
          type: 'doc',
          id: 'Commerce  Ordering/ecommerce-integration-guide',
          label: 'Ecommerce Integration Guide',
        },
        {
          type: 'doc',
          id: 'Commerce  Ordering/order-placement',
          label: 'Order Management',
        },
        {
          type: 'doc',
          id: 'Commerce  Ordering/basket-management',
          label: 'Basket Management',
        },
        {
          type: 'doc',
          id: 'Commerce  Ordering/checkout-process',
          label: 'Checkout Process',
        },
        {
          type: 'doc',
          id: 'Commerce  Ordering/payment-integration',
          label: 'Payment Integration',
        },
        {
          type: 'doc',
          id: 'Commerce  Ordering/shipping-integration',
          label: 'Shipping Integration',
        },
      ],
    },
    {
      type: 'category',
      label: 'Hotline & OIDC',
      items: [
        {
          type: 'doc',
          id: 'hotline-and-oidc/Hotline-OIDC-Documentation',
          label: 'Hotline OIDC Documentation',
        },
      ],
    },
  ],
};

module.exports = sidebars;

