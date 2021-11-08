import React from 'react';

import { TargetProgressIndicator } from './target-progress-indicator.component';

export default {
  title: 'Dashboard/Widgets/Target Progress Indicator',
};

const Template = args => {
  const [progress, setProgress] = React.useState(11);
  return (
    <div style={{ padding: '2rem' }}>
      <TargetProgressIndicator progress={progress} {...args} />
      <button
        style={{ margin: '2rem' }}
        onClick={() => setProgress(Math.floor(Math.random() * 100))}
      >
        Change Percentage
      </button>
    </div>
  );
};

export const Default = Template.bind({});
