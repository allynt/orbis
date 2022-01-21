import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import { BookmarksListItem } from './bookmarks-list-item.component';

export default {
  title: 'Bookmarks/Bookmarks List/Bookmarks List Item',
  argTypes: {
    onSelect: { action: 'onSelect' },
    onDelete: { action: 'onDelete' },
  },
};

if (isChromatic()) faker.seed(1);

/** @type {Partial<import('typings').Bookmark>} */
const bookmark = {
  id: faker.random.number(),
  owner: faker.random.uuid(),
  thumbnail: isChromatic() ? undefined : faker.image.nature(),
  title: faker.lorem.words(faker.random.number(9) + 1),
  description: faker.lorem.lines(2),
};

const Template = args => <BookmarksListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  bookmark,
};

export const NoImage = Template.bind({});
NoImage.args = {
  bookmark: {
    ...bookmark,
    thumbnail: null,
  },
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  bookmark: {
    ...bookmark,
    description: null,
  },
};
