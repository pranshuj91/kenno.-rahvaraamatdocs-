import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'What is Rahva Raamat?',
    description: (
      <>
        <a href="https://rahvaraamat.ee/en" target="_blank" rel="noopener noreferrer">Rahva Raamat</a> is Estonia's oldest and largest bookstore.
        It serves readers through physical stores, e-commerce, e-books, and audiobooks — delivering books and digital content
        to thousands of customers every day.
      </>
    ),
  },
  {
    title: 'How It Works',
    description: (
      <>
        The Rahva Raamat backend powers the full bookstore platform: product catalog, inventory, users, orders,
        subscriptions, admin tools, secure authentication, and monitoring — across web, mobile, and in-store systems.
      </>
    ),
  },
  {
    title: 'Getting Started',
    description: (
      <>
        Start from the <a href="/docs/intro">Rahvaraamat E-commerce Backend Documentation</a> button above, or open{' '}
        <a href="/docs/intro">Developer Docs</a> in the top menu. Follow the Setup Guide to configure your environment,
        install dependencies, and begin local development.
      </>
    ),
  },
];

function Feature({Svg, title, description, idx}) {
  return (
    <div className={clsx('col', idx < 3 ? 'col--4' : 'col--6', styles.featureCol)}>
      <div className={styles.featureCard}>
        {Svg && (
          <div className="text--center">
            <Svg className={styles.featureSvg} role="img" />
          </div>
        )}
        <div className="text--center">
          <Heading as="h3">{title}</Heading>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
