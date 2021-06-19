import * as React from 'react';

import ResultsListItem from './results-list-item.component';

export default {
  title: 'Orbs/AIS Shipping/ResultsListItem',
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
      'Vessel Name': 'Lollipop',
      'Vessel Type': 'Pleasure/Leisure',
      'Vessel Flag': 'United States of America',
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
      'Vessel Name': 'Lollipop',
      'Vessel Type': 'Pleasure/Leisure',
      'Vessel Flag': 'United States of America',
    },
  },
};

export const IsLoading = Template.bind({});
IsLoading.args = {
  ...Result.args,
  isLoading: true,
};
