import * as React from 'react';

import DataLayersDialog from './data-layers-dialog.component';

export default {
  title: 'Data Layers/DataLayersDialog',
  args: { open: true },
  argTypes: { close: { action: 'close' }, onSubmit: { action: 'onSubmit' } },
};

const generateOrbs = (n, parentId) =>
  new Array(n).fill(undefined).map((_, i) => ({
    source_id: `test/Source/${i}`,
    metadata: {
      label: `test-label-${i}`,
      description: 'Test description',
      application: {
        orbis: {
          categories: {
            name: `Test Parent Name ${parentId || i}`,
            child: {
              name: `Test Child Name ${parentId || i}`,
            },
          },
          sources: [
            {
              name: `Test Orb Name ${parentId || i}`,
            },
          ],
        },
      },
    },
  }));

const Template = args => <DataLayersDialog {...args} />;

export const Empty = Template.bind({});

export const Orbs = Template.bind({});
Orbs.args = {
  sources: generateOrbs(4),
};

export const LotsOfOrbs = Template.bind({});
LotsOfOrbs.args = {
  sources: new Array(50).fill(undefined).map((_, i) => ({
    metadata: {
      application: {
        orbis: {
          orbs: [{ name: `test-orb-${i}`, description: 'test' }],
        },
      },
    },
  })),
};

export const LotsOfSources = Template.bind({});
LotsOfSources.args = {
  sources: generateOrbs(50),
};

export const LotsOfBoth = Template.bind({});
LotsOfBoth.args = {
  sources: (() => {
    const sources = new Array(50).fill(undefined).map((_, i) => i);
    return sources.reduce((acc, cur) => {
      const sources = generateOrbs(50, cur);
      return [...acc, ...sources];
    }, []);
  })(),
};
