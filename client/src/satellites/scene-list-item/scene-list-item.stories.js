import React from 'react';

import { IconButton, DeleteIcon, List } from '@astrosat/astrosat-ui';

import faker from 'faker/locale/en_GB';

import SceneListItem, {
  SceneListItemSkeleton,
} from './scene-list-item.component';

export default { title: 'Satellites/SceneListItem' };

const Template = args => (
  <List>
    <SceneListItem {...args} />
  </List>
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

export const SecondaryAction = Template.bind({});
SecondaryAction.args = {
  ...WithScene.args,
  secondaryAction: (
    <IconButton>
      <DeleteIcon />
    </IconButton>
  ),
};

export const Skeleton = () => <SceneListItemSkeleton />;
