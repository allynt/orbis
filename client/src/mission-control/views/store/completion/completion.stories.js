import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { Completion } from './completion.component';

export default { title: 'Mission Control/Store/Completion' };

const Template = args => (
  <MemoryRouter>
    <Completion {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  orbs: [
    // @ts-ignore
    { id: 1, name: 'Orb 1' },
    // @ts-ignore
    { id: 2, name: 'Orb 2' },
  ],
  // @ts-ignore
  location: { search: '?orbId=1&users=10' },
};
