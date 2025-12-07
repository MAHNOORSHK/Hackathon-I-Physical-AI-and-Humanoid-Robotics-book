import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures'; // Existing component

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>Your journey into the world of embodied intelligence starts here. Master Physical AI & Humanoid Robotics with our comprehensive textbook.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning Now
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/chatbot">
            Ask Our AI Chatbot
          </Link>
        </div>
      </div>
    </header>
  );
}

function AboutSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <h2 className={styles.sectionTitle}>About This Textbook</h2>
            <p className={styles.sectionDescription}>
              This textbook bridges the gap between digital AI and the physical world, focusing on embodied intelligence. 
              It equips students with the knowledge and skills to design, simulate, and deploy humanoid robots capable of natural human interactions. 
              Explore cutting-edge topics from ROS 2 fundamentals to NVIDIA Isaac and Vision-Language-Action models.
            </p>
            <Link className="button button--primary" to="/docs/why-physical-ai-matters">
              Learn Why Physical AI Matters
            </Link>
          </div>
          <div className="col col--6">
            {/* Placeholder for an image or graphic */}
            <img src="/img/undraw_docusaurus_react.svg" alt="Physical AI Concept" className={styles.aboutImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "An indispensable guide for anyone serious about humanoid robotics. The practical insights are invaluable!",
      author: "Zia Khan, Panaverse Founder",
    },
    {
      quote: "The best resource I've found for integrating LLMs with robotics. Highly recommended for future AI engineers.",
      author: "Rehan Sadiq, AI Architect",
    },
    {
      quote: "Clear, comprehensive, and forward-thinking. This textbook is shaping the next generation of Physical AI experts.",
      author: "Junaid Ahmed, Robotics Engineer",
    },
  ];

  return (
    <section className={clsx(styles.section, styles.testimonialsSection)}>
      <div className="container">
        <h2 className={styles.sectionTitle}>What Learners Say</h2>
        <div className="row">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <p className={styles.testimonialAuthor}>- {testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home | ${siteConfig.title}`}
      description="An open-source textbook to master the future of AI in the physical world.">
      <HomepageHero />
      <main className={styles.mainContent}>
        <HomepageFeatures />
        <AboutSection />
        <TestimonialsSection />
      </main>
    </Layout>
  );
}

