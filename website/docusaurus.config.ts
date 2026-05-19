import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_URL = 'https://github.com/ForliLabs/casa-studente';

const config: Config = {
  title: 'CasaStudente',
  tagline:
    'The student housing marketplace that makes renting in Forlì transparent, fast, and safe.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://casastudente.it',
  baseUrl: '/',

  organizationName: 'ForliLabs',
  projectName: 'casa-studente',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: `${GITHUB_URL}/tree/main/website/`,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: `${GITHUB_URL}/tree/main/website/`,
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: true,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/og-image.svg',
    metadata: [
      {
        name: 'description',
        content:
          'CasaStudente is the verified, all-inclusive student housing marketplace for the University of Bologna Forlì campus.',
      },
      {name: 'keywords', content: 'student housing, Forlì, UniBo, rent, Italy, Erasmus'},
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    announcementBar: {
      id: 'launch_announcement',
      content:
        '🎓 CasaStudente is opening listings for the 2026/27 academic year — <a href="/docs/getting-started">get started in 5 minutes</a>.',
      backgroundColor: '#fef3c7',
      textColor: '#1f2937',
      isCloseable: true,
    },
    navbar: {
      title: 'CasaStudente',
      logo: {
        alt: 'CasaStudente logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/docs/getting-started', label: 'Get Started', position: 'left'},
        {to: '/docs/api/rest', label: 'API', position: 'left'},
        {to: '/docs/guides/student-quickstart', label: 'Guides', position: 'left'},
        {to: '/blog', label: 'Changelog', position: 'left'},
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Getting Started', to: '/docs/getting-started'},
            {label: 'Architecture', to: '/docs/concepts/architecture'},
            {label: 'API Reference', to: '/docs/api/rest'},
          ],
        },
        {
          title: 'Guides',
          items: [
            {label: 'For Students', to: '/docs/guides/student-quickstart'},
            {label: 'For Landlords', to: '/docs/guides/landlord-onboarding'},
            {label: 'Stripe Payments', to: '/docs/guides/stripe-payments'},
            {label: 'AI Features', to: '/docs/guides/ai-features'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: GITHUB_URL},
            {label: 'Discussions', href: `${GITHUB_URL}/discussions`},
            {label: 'Issues', href: `${GITHUB_URL}/issues`},
            {label: 'Contributing', to: '/docs/contributing'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Changelog', to: '/blog'},
            {label: 'FAQ', to: '/docs/faq'},
            {label: 'Comparison', to: '/docs/comparison'},
            {label: 'Code of Conduct', to: '/docs/code-of-conduct'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CasaStudente · Built with Docusaurus · Made in Forlì 🇮🇹`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'tsx'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
