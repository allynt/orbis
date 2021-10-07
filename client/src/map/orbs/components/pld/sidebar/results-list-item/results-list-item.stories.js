import * as React from 'react';

import ResultsListItem from './results-list-item.component';

export default {
  title: 'Orbs/PLD/ResultsListItem',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

const Template = args => <ResultsListItem {...args} />;

export const NoResult = Template.bind({});

export const Result = Template.bind({});
Result.args = {
  selected: true,
  result: {
    properties: {
      'Project ID': 'Item Title',
      Address: 'Test Address',
      'Development Type': 'Test Development Type',
    },
  },
};

export const Categories = ({ result, ...rest }) => (
  <>
    <ResultsListItem result={result} {...rest} />
    <ResultsListItem result={result} {...rest} />
    <ResultsListItem result={result} {...rest} />
  </>
);
Categories.args = {
  result: {
    properties: {
      'Project ID': 'Test ID',
      Address: 'Test Address',
      'Development Type': 'Test Development Type',
    },
  },
};

export const IsLoading = Template.bind({});
IsLoading.args = {
  ...Result.args,
  isLoading: true,
};
