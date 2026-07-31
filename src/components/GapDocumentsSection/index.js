import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function GapDocumentsSection() {
  return (
    <section className={styles.gapSection}>
      <div className="container">
        <div className={styles.gapInner}>
          <Heading as="h2" className={styles.gapTitle}>
            Gap Documents
          </Heading>
          <p className={styles.gapText}>
            Gap topics are already covered in Developer Docs. This section gathers
            them by ID — Critical Production, Business, Operational, and
            Infrastructure — so you can review coverage and open each item in one place.
          </p>
          <Link
            className="button button--secondary button--lg"
            to="/gaps/intro">
            Open Gap Documents
          </Link>
        </div>
      </div>
    </section>
  );
}
