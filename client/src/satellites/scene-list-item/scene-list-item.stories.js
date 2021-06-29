import React from 'react';

import faker from 'faker/locale/en_GB';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import SceneListItem, {
  SceneListItemSkeleton,
} from './scene-list-item.component';

const mockStore = configureMockStore();

export default { title: 'Satellites/SceneListItem' };

const Template = args => (
  <Provider store={mockStore({ satellites: {} })}>
    <SceneListItem {...args} />
  </Provider>
);

export const NoScene = Template.bind({});

export const WithScene = Template.bind({});
WithScene.args = {
  scene: {
    id: faker.random.uuid(),
    created: faker.date.past().toISOString(),
    cloudCover: 0,
    tier: 'free',
    thumbnail_url: faker.image.imageUrl(),
  },
};

export const Skeleton = () => <SceneListItemSkeleton />;
