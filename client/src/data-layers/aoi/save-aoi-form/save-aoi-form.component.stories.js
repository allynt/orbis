import React from 'react';

import { Dialog, DialogContent, DialogTitle } from '@astrosat/astrosat-ui';

import SaveAoiForm from './save-aoi-form.component';

export default {
  title: 'Data Layers/Aoi/SaveAoiForm',
  argTypes: { onSubmit: { action: 'onSubmit' } },
};

const Template = args => <SaveAoiForm {...args} />;

export const Default = Template.bind({});

export const InDialog = args => (
  <Dialog open={true}>
    <DialogTitle>Name Your Selected Area</DialogTitle>
    <DialogContent>
      <SaveAoiForm {...args} />
    </DialogContent>
  </Dialog>
);
