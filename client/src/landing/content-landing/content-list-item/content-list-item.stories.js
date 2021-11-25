import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import { ContentListItem } from './content-list-item.component';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Landing/Content Landing/Content List Item',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

const Template = args => <ContentListItem {...args} />;

export const NoBookmark = Template.bind({});
export const NoDashboard = Template.bind({});

/** @type {import('typings').Bookmark} */
const bookmark = {
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
  created: faker.date.past(undefined, new Date(2077, 10, 24)).toISOString(),
};

/** @type {import('typings').Dashboard} */
const dashboard = {
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
};

export const Bookmark = Template.bind({});
Bookmark.args = {
  bookmark,
};

export const Dashboard = Template.bind({});
Dashboard.args = {
  dashboard,
};
