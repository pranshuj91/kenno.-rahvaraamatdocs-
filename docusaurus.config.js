// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
const {themes: prismThemes} = require('prism-react-renderer');
//import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rahva Raamat Website Setup & Developer Guide',
  tagline: 'Developer guide for Estonia\'s largest bookstore platform',
  favicon: 'img/logo-main-new-cvi.webp',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://kenno.gaincafe.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vibhanshuGaincafe', // Usually your GitHub org/user name.
  projectName: 'gaincafe-project-documentatin', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en"   with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false ,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gaps',
        path: 'gap-docs',
        routeBasePath: 'gaps',
        sidebarPath: './sidebarsGaps.js',
        editUrl: undefined,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      // Disable color mode toggle
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Open Graph / social preview image (1200x630 recommended)
      image: 'img/og-social-card.jpg',
      metadata: [
        {name: 'twitter:card', content: 'summary_large_image'},
        {
          name: 'twitter:image',
          content: 'https://kenno.gaincafe.com/img/og-social-card.jpg',
        },
        {
          property: 'og:image',
          content: 'https://kenno.gaincafe.com/img/og-social-card.jpg',
        },
        {
          property: 'og:image:type',
          content: 'image/jpeg',
        },
        {
          property: 'og:image:alt',
          content: 'Rahva Raamat Developer Documentation',
        },
      ],
      navbar: {
        title: '',//Rahva Raamat Website Setup & Developer Guide',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo-main-new-cvi.webp',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Developer Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'gapsSidebar',
            docsPluginId: 'gaps',
            position: 'left',
            label: 'Gap Documents',
          },
          {
            to: '/about',
            label: 'About',
            position: 'right',
          },
          {
            href: 'https://github.com/Rahva-Raamat/ecommerce-backend',
            label: 'GitHub',
            position: 'right',
          },
        {
          type: 'html',
          position: 'right',
          value: '<img src="/img/sleeping-cat.1ee7c197.svg" alt="Cat" style="height:42px; width:42px; margin-left:1.5rem; margin-right:0.5rem; opacity:1; transition:0.4s; vertical-align:bottom; transform:translateY(24px) scale(1); z-index:1000; position:relative; padding:0px; margin:0px;" onmouseover="this.style.transform=\'translateY(20px) scale(1.05)\'" onmouseout="this.style.transform=\'translateY(24px) scale(1)\'" />',
        }
            ], 

      },


      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      }
      }
    };

module.exports = config;
