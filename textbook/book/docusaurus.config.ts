import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the gap between the digital brain and the physical body.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://hackathon-i-physical-ai-and-humanoi-one.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  customFields: {
    apiBaseUrl: process.env.DOCUSAURUS_API_BASE_URL || 'http://localhost:8000',
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MAHNOORSHK', // Usually your GitHub org/user name.
  projectName: 'Hackathon-I-Physical-AI-and-Humanoid-Robotics-Textbook-GIAIC-Q4', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/MAHNOORSHK/Hackathon-I-Physical-AI-and-Humanoid-Robotics-book/tree/main/textbook/book/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Panaverse Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Course',
        },
        {
          href: 'https://github.com/MAHNOORSHK/Hackathon-I-Physical-AI-and-Humanoid-Robotics-book',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'custom-userStatus',
          position: 'right',
        },
        {
          to: '/login',
          label: 'Login',
          position: 'right',
          className: 'navbar-login-link',
        },
        {
          to: '/signup',
          label: 'Signup',
          position: 'right',
          className: 'navbar-signup-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Course',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Connect With Me',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MAHNOORSHK',
            },
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/in/mahnoor-shaikh',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/Mahnoor16081999',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Project Repository',
              href: 'https://github.com/MAHNOORSHK/Hackathon-I-Physical-AI-and-Humanoid-Robotics-book',
            },
          ],
        },
      ],
      copyright: `Copyright © 2025 Built by Mahnoor Sheikh | Sunday 2pm to 5pm Batch`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
