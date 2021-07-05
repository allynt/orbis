import React from 'react';

import SaveSearchForm from './save-search-form.component';

export default {
  title: 'Satellites/SaveSearchForm',
  argTypes: {
    saveSearch: { action: true },
  },
};

const Template = args => <SaveSearchForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
