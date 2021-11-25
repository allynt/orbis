import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import AoiListItem from './aoi-list-item.component';

export default {
  title: 'Data Layers/Aoi/AOI List Item',
  argTypes: {
    selectAoi: { action: 'selectAoi' },
    editAoi: { action: 'editAoi' },
    deleteAoi: { action: 'deleteAoi' },
  },
};

if (isChromatic()) faker.seed(1);

const aoi = {
  id: faker.random.number(),
  owner: faker.random.uuid(),
  thumbnail: isChromatic() ? undefined : faker.image.nature(),
  name: faker.lorem.words(faker.random.number(9) + 1),
  description: faker.lorem.lines(2),
  info: faker.lorem.lines(2),
};

const Template = args => <AoiListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  aoi,
};

export const NoImage = Template.bind({});
NoImage.args = {
  aoi: {
    ...aoi,
    thumbnail: null,
  },
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  aoi: {
    ...aoi,
    description: null,
  },
};
