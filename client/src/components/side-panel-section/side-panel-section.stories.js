import React from 'react';

import { SidePanelSection } from './side-panel-section.component';

export default { title: 'Components/SidePanelSection' };

const Template = args => <SidePanelSection {...args} />;

export const NoChildren = Template.bind({});
NoChildren.args = {
  title: 'Test Layer',
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  ...NoChildren.args,
  children: <div>Child Component</div>,
};

export const WithInfo = Template.bind({});
WithInfo.args = {
  ...WithChildren.args,
  info: 'This is the info icon',
};
