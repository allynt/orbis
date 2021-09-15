import React from 'react';

import faker from 'faker/locale/en_GB';

import { Storage } from './storage.component';

const TEST_FILES = new Array(20).fill().map(() => ({
  id: faker.random.uuid(),
  title: faker.name.jobTitle(),
  date: faker.date.past().toISOString(),
}));

export default {
  title: 'Mission Control/Storage',
};

const Template = args => <Storage {...args} />;

export const Default = Template.bind({});
Default.args = {
  files: TEST_FILES,
};

export const EmptyData = Template.bind({});
EmptyData.args = {
  files: [],
};

export const NoData = Template.bind({});
NoData.args = {
  files: null,
};
