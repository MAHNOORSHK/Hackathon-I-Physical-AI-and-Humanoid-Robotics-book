import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const LearnList: FeatureItem[] = [
  {
    title: 'Physical AI Principles',
    description: <>Understand the core concepts of embodied intelligence.</>,
  },
  {
    title: 'ROS 2 Mastery',
    description: <>Learn to control robots with the Robot Operating System.</>,
  },
  {
    title: 'Simulation Skills',
    description: <>Simulate robots in realistic environments with Gazebo and Unity.</>,
  },
  {
    title: 'NVIDIA Isaac',
    description: <>Develop on the leading platform for AI robotics.</>,
  },
];

const ModuleList: FeatureItem[] = [
  {
    title: 'Module 1: ROS 2',
    description: <>The Robotic Nervous System.</>,
  },
  {
    title: 'Module 2: Digital Twin',
    description: <>Simulation with Gazebo & Unity.</>,
  },
  {
    title: 'Module 3: NVIDIA Isaac',
    description: <>The AI-Robot Brain.</>,
  },
  {
    title: 'Module 4: VLA',
    description: <>Vision-Language-Action Models.</>,
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--left padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Module({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>What You'll Learn</h2>
          </div>
          {LearnList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className="row" style={{ marginTop: '4rem' }}>
          <div className="col col--12">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Modules</h2>
          </div>
          {ModuleList.map((props, idx) => (
            <Module key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
