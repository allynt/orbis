import React from 'react';

import { Intro } from './intro.component';

export default { title: 'Data Layers/User Upload/Intro' };

const Template = args => <Intro {...args} />;

export const Default = Template.bind({});
Default.args = {};
