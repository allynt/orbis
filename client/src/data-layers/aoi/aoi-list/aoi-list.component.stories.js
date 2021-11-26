import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import { SidePanel } from 'components/side-panel/side-panel.component';

import AoiList from './aoi-list.component';

export default {
  title: 'Data Layers/Aoi/AOI List',
  argTypes: {
    selectAoi: { action: 'selectAoi' },
    editAoi: { action: 'editAoi' },
    deleteAoi: { action: 'deleteAoi' },
  },
};

if (isChromatic()) faker.seed(1);

const iShouldDoIt = () => isChromatic() || Math.random() > 0.5;

const createAoi = (_, id) => ({
  id,
  owner: faker.random.uuid(),
  thumbnail: iShouldDoIt() ? undefined : faker.image.image(),
  name: faker.lorem.words(faker.random.number(9) + 1),
  description: iShouldDoIt() && faker.lorem.lines(2),
  info: faker.lorem.lines(2),
});

const Template = args => <AoiList {...args} />;

export const NoAois = Template.bind({});

export const Aois = Template.bind({});
Aois.args = {
  aois: Array(faker.random.number(9) + 1)
    .fill(undefined)
    .map(createAoi),
};

export const InSidebarNoAois = ({ state, ...args }) => (
  <SidePanel open={true}>
    <AoiList {...args} />
  </SidePanel>
);

export const InSidebarWithAois = ({ state, ...args }) => (
  <SidePanel open={true}>
    <AoiList
      {...args}
      aois={Array(faker.random.number(9) + 1)
        .fill(undefined)
        .map(createAoi)}
    />
  </SidePanel>
);
