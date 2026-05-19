import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'concepts/architecture',
        'concepts/data-model',
        'concepts/auth-and-trust',
        'concepts/listings-and-search',
        'concepts/messaging',
        'concepts/payments',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/student-quickstart',
        'guides/landlord-onboarding',
        'guides/roommate-matching',
        'guides/stripe-payments',
        'guides/ai-features',
        'guides/leases-and-documents',
        'guides/admin-operations',
        'guides/deploying-to-vercel',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/rest',
        'api/server-actions',
        'api/webhooks',
        'api/errors',
        'api/rate-limits',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['config/environment', 'config/scripts', 'config/feature-flags'],
    },
    'comparison',
    'troubleshooting',
    'faq',
    'contributing',
    'code-of-conduct',
    'security',
    'changelog',
  ],
};

export default sidebars;
