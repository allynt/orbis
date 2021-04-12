import React from 'react';
import { DrawingToolsToolbox } from './drawing-tools-toolbox.component';

export default {
  title: 'Drawing Tools/Toolbox',
  args: { open: true },
  argTypes: { onButtonClick: { action: true }, onToolSelect: { action: true } },
};

const Template = args => <DrawingToolsToolbox {...args} />;

export const Default = Template.bind({});
