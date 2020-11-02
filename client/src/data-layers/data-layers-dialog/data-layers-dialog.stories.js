import * as React from 'react';

import DataLayersDialog from './data-layers-dialog.component';

export default { title: 'Data Layers/DataLayersDialog' };

export const Test = () => (
  <DataLayersDialog ref={{ current: document.body }} isVisible />
);
