import React from 'react';

import { UserUpload } from './user-upload.component';

export default { title: 'Data Layers/User Upload' };

const Template = args => <UserUpload {...args} />;

export const Main = Template.bind({});
Main.args = {};
