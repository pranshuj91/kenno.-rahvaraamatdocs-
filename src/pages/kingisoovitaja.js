import clsx from 'clsx';
import Link from '@docusaurus/Link';
import CustomLayout from '@site/src/components/CustomLayout';
import Heading from '@theme/Heading';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import homeStyles from './index.module.css';
import featureStyles from '@site/src/components/HomepageFeatures/styles.module.css';

const TITLE = 'Kingisoovitaja: AI Gift Advisor Setup & Developer Guide';
const TAGLINE =
  "Developer guide for Rahva Raamat's AI gift advisor (kingisoovitaja.ee)";

const FeatureList = [
  {
    title: 'What is Kingisoovitaja?',
    description: (
      <>
        <a href="https://kingisoovitaja.ee" target="_blank" rel="noopener noreferrer">Kingisoovitaja.ee</a> is
        an AI gift advisor for Rahva Raamat. A shopper writes in Estonian, the assistant searches the
        catalogue, picks fitting gifts and answers with a short reply and product cards. The shopper can
        check out on kingisoovitaja.ee as a normal rahvaraamat.ee order.
      </>
    ),
  },
  {
    title: 'How It Works',
    description: (
      <>
        A plain PHP 8.5 backend with MariaDB and Meilisearch hybrid search, Google Gemini and OpenAI for
        understanding and choosing gifts, a Next.js website, and Caddy in front, all in Docker Compose.
        The e-shop provides the product feed, same-day changes and the checkout API.
      </>
    ),
  },
  {
    title: 'Getting Started',
    description: (
      <>
        Start from the <Link to="/kingisoovitaja/docs/">Kingisoovitaja Documentation</Link> button above.
        Follow <Link to="/kingisoovitaja/docs/development-setup">Development Setup</Link> to run it locally,
        and see <Link to="/kingisoovitaja/docs/knowledge-transfer">Knowledge Transfer</Link> for what is
        still open.
      </>
    ),
  },
];

function KingisoovitajaHeader() {
  return (
    <header className={clsx('hero hero--primary', homeStyles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {TITLE}
        </Heading>
        <p className="hero__subtitle">{TAGLINE}</p>
        <div className={homeStyles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/kingisoovitaja/docs/">
            Kingisoovitaja Documentation
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/kingisoovitaja/docs/architecture">
            Architecture
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/kingisoovitaja/docs/deployment">
            Deployment & DevOps
          </Link>
        </div>
      </div>
    </header>
  );
}

function KingisoovitajaFeatures() {
  return (
    <section className={featureStyles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map(({title, description}) => (
            <div key={title} className={clsx('col col--4', featureStyles.featureCol)}>
              <div className={featureStyles.featureCard}>
                <div className="text--center">
                  <Heading as="h3">{title}</Heading>
                </div>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Kingisoovitaja() {
  return (
    <HtmlClassNameProvider className="plugin-id-kingisoovitaja kingi-landing">
    <CustomLayout title="Kingisoovitaja" description={TAGLINE}>
      <KingisoovitajaHeader />
      <main>
        <KingisoovitajaFeatures />
      </main>
    </CustomLayout>
    </HtmlClassNameProvider>
  );
}
