import * as React from 'react';

import faker from '@faker-js/faker/locale/en_GB';
import isChromatic from 'chromatic/isChromatic';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';

import BookmarksPanel from './bookmarks-panel.component';

if (isChromatic()) faker.seed(1);

const mockStore = configureMockStore([thunk]);

export default { title: 'Bookmarks/Bookmarks Panel' };

const iShouldDoIt = () => isChromatic() || Math.random() > 0.5;

const createBookmark = (_, id) => ({
  id,
  owner: faker.random.uuid(),
  thumbnail: iShouldDoIt() ? undefined : faker.image.image(),
  title: faker.lorem.words(faker.random.number(9) + 1),
  description: iShouldDoIt() && faker.lorem.lines(2),
});

const Template = ({ state, ...args }) => (
  <Provider store={mockStore(state)}>
    <MapProvider>
      <BookmarksPanel {...args} />
    </MapProvider>
  </Provider>
);

export const Default = Template.bind({});

export const ExistingBookmarks = Template.bind({});
ExistingBookmarks.args = {
  state: {
    bookmarks: {
      bookmarks: Array(faker.random.number(9) + 1)
        .fill(undefined)
        .map(createBookmark),
    },
  },
};
