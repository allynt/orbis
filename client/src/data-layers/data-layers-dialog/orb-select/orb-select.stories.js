import * as React from 'react';

import { OrbSelect } from './orb-select.component';

export default {
  title: 'Data Layers/DataLayersDialog/OrbSelect',
  argTypes: { onDomainClick: { action: 'onDomainClick' } },
};

const Template = args => <OrbSelect {...args} />;

export const NoOrbs = Template.bind({});

export const Orbs = Template.bind({});
Orbs.args = {
  domains: [{ label: 'Test 1' }, { label: 'Test 2' }],
};

export const SelectedOrb = Template.bind({});
SelectedOrb.args = {
  ...Orbs.args,
  selectedDomain: { label: 'Test 1' },
};

export const LotsOfOrbs = Template.bind({});
LotsOfOrbs.args = {
  domains: new Array(20)
    .fill(undefined)
    .map((_, i) => ({ label: `Test ${i}` })),
};
