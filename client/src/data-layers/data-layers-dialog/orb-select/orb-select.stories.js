import * as React from 'react';

import { OrbSelect } from './orb-select.component';

export default {
  title: 'Data Layers/DataLayersDialog/OrbSelect',
  argTypes: { onOrbClick: { action: 'onOrbClick' } },
};

const Template = args => <OrbSelect {...args} />;

export const NoOrbs = Template.bind({});

export const Orbs = Template.bind({});
Orbs.args = {
  orbs: [{ name: 'Test 1' }, { name: 'Test 2' }],
};

export const SelectedOrb = Template.bind({});
SelectedOrb.args = {
  ...Orbs.args,
  selectedOrbName: 'Test 1',
};

export const LotsOfOrbs = Template.bind({});
LotsOfOrbs.args = {
  orbs: new Array(20).fill(undefined).map((_, i) => ({ name: `Test ${i}` })),
};
