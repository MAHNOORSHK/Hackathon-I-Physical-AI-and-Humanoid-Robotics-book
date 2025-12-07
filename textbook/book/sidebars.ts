import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Modules',
      items: [
        'modules/module-1-ros2',
        'modules/module-2-digital-twin',
        'modules/module-3-isaac',
        'modules/module-4-vla',
      ],
    },
    'why-physical-ai-matters',
    'learning-outcomes',
    {
      type: 'category',
      label: 'Weekly Breakdown',
      items: [
        'weekly-breakdown/weeks-1-2',
        'weekly-breakdown/weeks-3-5',
        'weekly-breakdown/weeks-6-7',
        'weekly-breakdown/weeks-8-10',
        'weekly-breakdown/weeks-11-12',
        'weekly-breakdown/week-13',
      ],
    },
    'assessments',
    'hardware-requirements',
  ],
};

export default sidebars;