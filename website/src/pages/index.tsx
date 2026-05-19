import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const FEATURES = [
  {
    icon: '🛡️',
    title: 'Verified, scam-free listings',
    body:
      'Every property is photographed and visited. University-verified students only. Bronze/silver/gold trust tiers and 5-dimension reviews on both sides.',
  },
  {
    icon: '💸',
    title: 'Stripe-secured rent',
    body:
      'Stripe Connect Express marketplace handles rent, deposits, refunds and platform fees. Receipts, subscriptions and webhooks built in.',
  },
  {
    icon: '🧠',
    title: 'AI-powered search & chat',
    body:
      'Natural-language search ("singola luminosa entro 400€ vicino al Campus"), auto-generated listing copy and on-the-fly message translation.',
  },
  {
    icon: '🤝',
    title: 'Roommate matching',
    body:
      'Compatibility algorithm scores budget, sleep, cleanliness, social and language preferences so students find the right co-habitant, not just the cheapest room.',
  },
  {
    icon: '🌍',
    title: 'Multilingual by default',
    body:
      'Italian, English, Spanish and French. Designed for SSLMIT and Erasmus students who book before ever setting foot in Forlì.',
  },
  {
    icon: '📜',
    title: 'Italian-law compliant leases',
    body:
      'Digital lease contracts for transitorio, 4+4 and 3+2 with cedolare secca support, digital signatures and a per-user document vault.',
  },
];

const STATS = [
  {value: '24', label: 'Prisma models'},
  {value: '70+', label: 'Production features'},
  {value: '137', label: 'Unit tests'},
  {value: '4', label: 'Languages: IT · EN · ES · FR'},
];

const QUICKSTART = `# Clone and install
git clone https://github.com/ForliLabs/casa-studente.git
cd casa-studente
npm install

# Bootstrap environment (all external services are optional)
cp .env.example .env

# Generate Prisma client and start the dev server
npm run db:generate
npm run dev

# → http://localhost:3000`;

const API_SNIPPET = `// Fetch verified listings near the Forlì campus
const res = await fetch('https://casastudente.it/api/listings');
const listings = await res.json();

const nearCampus = listings.filter(
  (l) => l.verified && l.zone === 'Campus' && l.price <= 400
);

console.log(\`\${nearCampus.length} affordable rooms near campus\`);
// → 12 affordable rooms near campus`;

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Verified student housing for Forlì"
      description="CasaStudente is the verified, all-inclusive student housing marketplace for the University of Bologna Forlì campus."
    >
      {/* Hero */}
      <header className={`${styles.hero} heroGradient`}>
        <span className={styles.eyebrow}>🎓 Built for the UniBo Forlì campus</span>
        <h1 className={styles.title}>
          Student housing in Forlì,{' '}
          <span className={styles.gradientText}>without the headaches.</span>
        </h1>
        <p className={styles.subtitle}>
          {siteConfig.tagline} Verified listings, all-inclusive pricing, roommate
          matching, Stripe-secured rent and Italian-law leases — in one open
          marketplace.
        </p>

        <div className={styles.cta}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started">
            Get Started → 5 min
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Read the Docs
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://github.com/ForliLabs/casa-studente">
            ⭐ Star on GitHub
          </Link>
        </div>

        <div
          className={styles.installBox}
          onClick={(e) => {
            const text = (e.currentTarget as HTMLDivElement).innerText.replace(/^\$\s*/, '');
            navigator.clipboard?.writeText(text);
          }}
          title="Click to copy">
          <span className={styles.installPrompt}>$</span>
          <span>npx degit ForliLabs/casa-studente my-app</span>
        </div>
        <div className={styles.copyHint}>Click the command to copy</div>

        <div className={styles.badges}>
          <img
            alt="Next.js"
            src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs"
          />
          <img
            alt="TypeScript"
            src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"
          />
          <img
            alt="Prisma"
            src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white"
          />
          <img
            alt="Stripe"
            src="https://img.shields.io/badge/Stripe-Connect-635BFF?logo=stripe&logoColor=white"
          />
          <img
            alt="Tests"
            src="https://img.shields.io/badge/tests-137%20passing-22c55e"
          />
          <img alt="License" src="https://img.shields.io/badge/license-TBD-gray" />
        </div>
      </header>

      {/* Stats */}
      <section className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Everything a student rental needs</h2>
        <p className={styles.sectionLead}>
          CasaStudente is not just a listings board. It’s an end-to-end rental
          stack — from discovery to deposit to dispute resolution.
        </p>

        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureBody}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Running in 5 minutes</h2>
        <p className={styles.sectionLead}>
          No database? No problem. The platform falls back to seeded in-memory
          stores so you can explore every feature without provisioning anything.
        </p>

        <div className={styles.codePreview}>
          <CodeBlock language="bash" title="Quickstart">
            {QUICKSTART}
          </CodeBlock>
          <CodeBlock language="ts" title="Fetch listings">
            {API_SNIPPET}
          </CodeBlock>
        </div>
      </section>

      {/* Audiences */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Two sides, one marketplace</h2>
        <p className={styles.sectionLead}>
          CasaStudente was designed from day one to serve both halves of the
          rental crisis in Forlì.
        </p>

        <div className={styles.audienceGrid}>
          <div className={styles.audienceCard}>
            <h3>🎒 For students</h3>
            <ul>
              <li>Verified, all-inclusive listings — no hidden utility surprises</li>
              <li>Natural-language search and saved-search alerts</li>
              <li>Roommate matching across language and lifestyle</li>
              <li>Pay rent in one click via Stripe or Satispay</li>
              <li>Italian, English, Spanish, French — the platform speaks your language</li>
            </ul>
            <Link className="button button--primary" to="/docs/guides/student-quickstart">
              Student quickstart →
            </Link>
          </div>

          <div className={styles.audienceCard}>
            <h3>🏘️ For landlords</h3>
            <ul>
              <li>UniBo-verified tenants with trust scores and references</li>
              <li>Stripe Connect payouts with platform fees handled for you</li>
              <li>Smart pricing suggestions and demand forecasting</li>
              <li>Cedolare secca-ready lease templates and tax receipts</li>
              <li>One dashboard for bookings, payments, tickets and reviews</li>
            </ul>
            <Link className="button button--primary" to="/docs/guides/landlord-onboarding">
              Landlord onboarding →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.sectionTitle}>Help us fix Forlì’s housing crisis.</h2>
        <p className={styles.sectionLead}>
          2,426 new students enroll in Forlì every year. 78% need housing. Only
          2,438 university beds exist for all of Romagna. We can do better — open
          source, in the open, together.
        </p>
        <div className={styles.cta}>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/contributing">
            Contribute
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://github.com/ForliLabs/casa-studente/discussions">
            Join the discussion
          </Link>
        </div>
      </section>
    </Layout>
  );
}
