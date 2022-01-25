import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import ResultsListItem from './results-list-item.component';

if (isChromatic()) faker.seed(1);

const Index = {
  title: 'Orbs/Crowdless/ResultsListItem',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

export default Index;

const Template = args => <ResultsListItem {...args} />;

export const NoResult = Template.bind({});

export const Result = Template.bind({});
Result.args = {
  selected: true,
  result: {
    properties: {
      name: faker.company.companyName(),
      address: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.zipCode(),
      ].join(', '),
      crowdednessCategory: faker.random.arrayElement([
        'not busy',
        'busy',
        'very busy',
      ]),
    },
  },
};

export const Categories = ({ result, ...rest }) => (
  <>
    <ResultsListItem
      result={{
        ...result,
        properties: {
          ...result.properties,
          crowdednessCategory: 'not busy',
        },
      }}
      {...rest}
    />
    <ResultsListItem
      result={{
        ...result,
        properties: {
          ...result.properties,
          crowdednessCategory: 'busy',
        },
      }}
      {...rest}
    />
    <ResultsListItem
      result={{
        ...result,
        properties: {
          ...result.properties,
          crowdednessCategory: 'very busy',
        },
      }}
      {...rest}
    />
  </>
);
Categories.args = {
  result: {
    properties: {
      name: faker.company.companyName(),
      address: faker.address.streetAddress(),
    },
  },
};

export const IsLoading = Template.bind({});
IsLoading.args = {
  ...Result.args,
  isLoading: true,
};
