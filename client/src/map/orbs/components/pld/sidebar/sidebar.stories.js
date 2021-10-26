import * as React from 'react';

import { PldSidebarComponent } from './sidebar.component';

export default {
  title: 'Orbs/PLD/SidebarComponent',
};

const metadata = {
  color: 'transparent',
  constructionPhaseFilters: [
    {
      icon: 'Circle',
      value: 'Approved',
      bgColor: '#75b7b2',
    },
    {
      icon: 'Circle',
      value: 'Commenced',
      bgColor: '#f52455',
    },
    {
      icon: 'Circle',
      value: 'Completed',
      bgColor: '#8aea73',
    },
  ],
  developmentTypeFilters: [
    {
      icon: 'Conversion',
      value: 'Conversion',
    },
    {
      icon: 'NewBuild',
      value: 'New Build',
    },
    {
      icon: 'ChangeOfUse',
      value: 'Change of Use',
    },
    {
      icon: 'Extension',
      value: 'Extension',
    },
  ],
  iconColor: 'white',
};

const Template = args => <PldSidebarComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  ...metadata,
};
