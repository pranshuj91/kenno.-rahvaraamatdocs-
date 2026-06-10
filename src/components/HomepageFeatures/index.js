import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'What is Rahva Raamat?',
    description: (
      <>
        <a href="https://rahvaraamat.ee/en" target="_blank" rel="noopener noreferrer">Rahva Raamat</a> is Estonia's oldest and largest bookstore, offering books via physical stores, 
        e-commerce, e-books, and audiobooks. The backend powers inventory, user management, orders, 
        subscriptions, and admin operations — delivering books and digital content to thousands of readers every day.
      </>
    ),
  },
  {
    title: 'How It Works',
    description: (
      <>
        Rahva Raamat's backend is the engine behind Estonia's largest bookstore platform, managing products, 
        users, orders, and subscriptions. It supports admin tools, secure authentication, and real-time system 
        monitoring — ensuring smooth digital operations and delivering content across web, mobile, and physical stores.
      </>
    ),
  },
  {
    title: 'Getting Started',
    description: (
      <>
        You can start exploring the documentation from anywhere — simply click on <a href="/docs/intro">"Getting Started"</a>, the <a href="/docs/intro">"Rahvaraamat"</a> 
        button, or the <a href="/docs/intro">"Developer Docs"</a> link in the top menu. Follow the Setup Guide to configure your environment, 
        install dependencies, and begin local development easily.
      </>
    ),
  },
];

function Feature({Svg, title, description, idx}) {
  return (
    <div className={clsx('col', idx < 3 ? 'col--4' : 'col--6')}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
