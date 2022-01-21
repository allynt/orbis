import React from 'react';

import { IconButton, DeleteIcon, List } from '@astrosat/astrosat-ui';

import faker from '@faker-js/faker/locale/en_GB';

import SceneListItem, {
  SceneListItemSkeleton,
} from './scene-list-item.component';

export default {
  title: 'Satellites/SceneListItem',
  argTypes: { onSceneClick: { action: true }, onHover: { action: true } },
};

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

export const Hovered = Template.bind({});
Hovered.args = {
  ...WithScene.args,
  hovered: true,
};

export const Skeleton = () => <SceneListItemSkeleton />;
