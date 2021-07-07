import React from 'react';

import SaveSearchForm from './save-search-form.component';

export default {
  title: 'Satellites/Results/SaveSearchForm',
  argTypes: {
    onSubmit: { action: true },
  },
};

const Template = args => <SaveSearchForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
