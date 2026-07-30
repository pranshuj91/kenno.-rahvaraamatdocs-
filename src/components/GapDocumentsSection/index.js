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
            A standalone tracker for documentation gaps — Critical Production,
            Business, Operational, and Infrastructure items. Separate from
            Developer Docs. Filled only where matching documentation already
            exists on this site.
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
