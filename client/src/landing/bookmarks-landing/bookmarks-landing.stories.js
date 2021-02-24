import faker from 'faker/locale/en_GB';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Router } from 'react-router-dom';
import { BookmarksLanding } from './bookmarks-landing.component';
import isChromatic from 'chromatic/isChromatic';

if (isChromatic()) faker.seed(1);

export default { title: 'Landing/Bookmarks Landing' };

const makeBookmark = () => ({
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic()
    ? 'http://placeimg.com/640/480/business'
    : faker.image.image(),
  created: faker.date.past().toISOString(),
});

const Template = args => (
  <Router history={createBrowserHistory()}>
    <BookmarksLanding {...args} />
  </Router>
);

export const Default = Template.bind({});

export const WithBookmarks = Template.bind({});
WithBookmarks.args = {
  bookmarks: Array(faker.random.number(3) + 1)
    .fill(undefined)
    .map(makeBookmark),
};

export const LotsOBookmarks = Template.bind({});
LotsOBookmarks.args = {
  bookmarks: Array(faker.random.number(29) + 1)
    .fill()
    .map(makeBookmark),
};
