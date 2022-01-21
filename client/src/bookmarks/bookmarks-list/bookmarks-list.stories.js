import * as React from 'react';

import faker from '@faker-js/faker/locale/en_GB';
import isChromatic from 'chromatic/isChromatic';

import BookmarkList from './bookmarks-list.component';

export default {
  title: 'Bookmarks/Bookmarks List',
  argTypes: {
    selectBookmark: { action: 'selectBookmark' },
    deleteBookmark: { action: 'deleteBookmark' },
  },
};

if (isChromatic()) faker.seed(1);

const iShouldDoIt = () => isChromatic() || Math.random() > 0.5;

const createBookmark = (_, id) => ({
  id,
  owner: faker.random.uuid(),
  thumbnail: iShouldDoIt() ? undefined : faker.image.image(),
  title: faker.lorem.words(faker.random.number(9) + 1),
  description: iShouldDoIt() && faker.lorem.lines(2),
});

const Template = args => <BookmarkList {...args} />;

export const NoBookmarks = Template.bind({});

export const Bookmarks = Template.bind({});
Bookmarks.args = {
  bookmarks: Array(faker.random.number(9) + 1)
    .fill(undefined)
    .map(createBookmark),
};
