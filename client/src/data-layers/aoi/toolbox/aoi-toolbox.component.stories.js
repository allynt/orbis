import React from 'react';

import AoiToolbox from './aoi-toolbox.component';

export default {
  title: 'Data Layers/Aoi/Sidebar/AoiToolbox',
  argTypes: { onToolSelect: { action: 'onToolSelect' } },
};

const Template = args => <AoiToolbox {...args} />;

export const Default = Template.bind({});
