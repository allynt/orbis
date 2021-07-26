import React from 'react';

import { SaveImageForm } from './save-image-form.component';

export default {
  title: 'Satellites/Visualisation/SaveImageForm',
  argTypes: { onSubmit: { action: true } },
};

const Template = args => <SaveImageForm {...args} />;

export const Default = Template.bind({});
