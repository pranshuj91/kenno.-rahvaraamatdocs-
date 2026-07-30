// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebarsGaps = {
  gapsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Gap Documents Overview',
    },
    {
      type: 'category',
      label: 'Critical — Production',
      collapsed: false,
      items: [
        'critical-production/CP-001-elasticsearch-spool',
        'critical-production/CP-002-cron-jobs',
        'critical-production/CP-003-nav-integration',
        'critical-production/CP-004-queue-system',
        'critical-production/CP-005-external-integrations',
        'critical-production/CP-006-backups',
      ],
    },
    {
      type: 'category',
      label: 'Important — Business',
      items: [
        'important-business/IB-001-payment-gateway',
        'important-business/IB-002-kafka-events',
        'important-business/IB-003-integration-reconciliation',
        'important-business/IB-004-notifications',
      ],
    },
    {
      type: 'category',
      label: 'Operational',
      items: [
        'operational/OP-001-deployment-release',
        'operational/OP-002-admin-panel-modules',
        'operational/OP-003-cleanup-jobs',
        'operational/OP-004-search-functionality',
        'operational/OP-005-subscription-management',
        'operational/OP-006-redirects',
        'operational/OP-007-sitemap',
        'operational/OP-008-feed-exporters',
        'operational/OP-009-statistics',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/IN-001-ssl-certificate',
        'infrastructure/IN-002-pm2-process',
        'infrastructure/IN-003-kafka-ssl',
        'infrastructure/IN-004-web-store-ssl',
        'infrastructure/IN-005-server-architecture',
        'infrastructure/IN-006-monitoring-alerting',
        'infrastructure/IN-007-log-management',
      ],
    },
  ],
};

module.exports = sidebarsGaps;
