import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import { ContentLanding } from './content-landing.component';

if (isChromatic()) faker.seed(1);

export default { title: 'Landing/Content Landing' };

const makeBookmark = () => ({
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
  created: faker.date.past(undefined, new Date(2077, 10, 24)).toISOString(),
});

const makeDashboard = () => ({
  id: faker.random.uuid(),
  title: faker.commerce.product(),
  thumbnail: isChromatic() ? undefined : faker.image.image(),
});

const Template = args => (
  <Router history={createBrowserHistory()}>
    <ContentLanding {...args} />
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

export const WithDashboards = Template.bind({});
WithDashboards.args = {
  dashboards: Array(faker.random.number(3) + 1)
    .fill(undefined)
    .map(makeDashboard),
};

export const LotsODashboards = Template.bind({});
LotsODashboards.args = {
  dashboards: Array(faker.random.number(27) + 1)
    .fill()
    .map(makeDashboard),
};
