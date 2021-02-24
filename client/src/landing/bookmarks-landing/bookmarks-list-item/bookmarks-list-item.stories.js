import { BookmarksListItem } from './bookmarks-list-item.component';
import faker from 'faker/locale/en_GB';
import * as React from 'react';
import isChromatic from 'chromatic/isChromatic';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Landing/Bookmarks Landing/Bookmarks List Item',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

const Template = args => <BookmarksListItem {...args} />;

export const NoBookmark = Template.bind({});

/** @type {import('typings/orbis').Bookmark} */
const bookmark = {
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
  created: faker.date.past().toISOString(),
};

export const Bookmark = Template.bind({});
Bookmark.args = {
  bookmark,
};
