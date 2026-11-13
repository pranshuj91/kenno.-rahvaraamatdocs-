// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebarsKingisoovitaja = {
  kingisoovitajaSidebar: [
    'intro',
    'architecture',
    'repository-structure',
    {
      type: 'category',
      label: 'Development',
      collapsed: false,
      items: ['development-setup', 'frontend', 'testing'],
    },
    {
      type: 'category',
      label: 'Backend',
      collapsed: false,
      items: ['chat-turn', 'catalogue-rules', 'data-pipeline', 'api-reference', 'database'],
    },
    {
      type: 'category',
      label: 'E-shop side',
      items: ['eshop-overview', 'eshop-features', 'eshop-api-checkout'],
    },
    {
      type: 'category',
      label: 'Deployment & DevOps',
      items: ['deployment', 'ci-cd', 'security-and-access'],
    },
    'integrations',
    'maintenance',
    'ga-tickets',
    'knowledge-transfer',
  ],
};

module.exports = sidebarsKingisoovitaja;
