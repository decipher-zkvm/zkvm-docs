import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Zero-Knowledge Virtual Machine Documentation">
      <main className={styles.main}>
        <div className={styles.heroBackground}>
          <img className={styles.superman1} src="/img/superman.png" alt="superman" />
          <img className={styles.superman2} src="/img/superman.png" alt="superman" />
          <img className={styles.superman3} src="/img/superman.png" alt="superman" />
          <img className={styles.superman4} src="/img/superman.png" alt="superman" />
          <img className={styles.superman5} src="/img/superman.png" alt="superman" />
          <div className={styles.pulseCircle}></div>
        </div>
        
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.zkText}>zkVM: </span>
            <span className={styles.heroText}> Zero to Hero</span>
          </h1>
          
          <p className={styles.tagline}>
            Master zkVM(Zero-Knowledge Virtual Machines) from fundamentals to advanced applications
          </p>
          
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📚</div>
              <h3>Deep Dive into zkVM</h3>
              <p className={styles.cardDescription}>
                Comprehensive docs covering zkVM history, architecture, and use cases
              </p>
              <Link
                className={styles.cardButton}
                to="/docs/parts-1-history/Introduction">
                Start Learning →
              </Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>🗳️</div>
              <h3>Real-World Application</h3>
              <p className={styles.cardDescription}>
                Trustless Multichain Governance Aggregator via zkVM
              </p>
              <Link
                className={styles.cardButton}
                to="https://github.com/decipher-zkvm/multichain-governance-aggregator">
                Explore Project →
              </Link>
            </div>
          </div>
          
          <footer className={styles.footer}>
            <div className={styles.footerDivider}></div>
            <p>Made with 💙 by <strong>Decipher</strong></p>
          </footer>
        </div>
      </main>
    </Layout>
  );
}