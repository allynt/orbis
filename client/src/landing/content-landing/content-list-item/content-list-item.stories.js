import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import { BookmarksListItem } from './content-list-item.component';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Landing/Bookmarks Landing/Bookmarks List Item',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

const Template = args => <BookmarksListItem {...args} />;

export const NoBookmark = Template.bind({});

/** @type {import('typings').Bookmark} */
const bookmark = {
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
  created: faker.date.past(undefined, new Date(2077, 10, 24)).toISOString(),
};

export const Bookmark = Template.bind({});
Bookmark.args = {
  bookmark,
};
