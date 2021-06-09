import React from 'react';

import { SidePanel } from './side-panel.component';

const header = (
  <>
    <h1>This is the header</h1>
    <p>Stuff goes here</p>
  </>
);

export default {
  title: 'Components/SidePanel',
  args: {
    open: true,
    children: (
      <>
        <h1>This is the content</h1>
      </>
    ),
  },
};

const Template = args => (
  <div style={{ height: '100vh' }}>
    <SidePanel {...args} />
  </div>
);

export const Left = Template.bind({});
Left.args = {
  header,
  orientation: 'left',
};

export const Right = Template.bind({});
Right.args = {
  header,
  orientation: 'right',
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  header: undefined,
};
