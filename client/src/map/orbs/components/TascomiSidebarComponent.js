import React from 'react';

import { SidebarComponent } from './tascomi/sidebar/sidebar.component';

const ConnectedWrapper = ({
  selectedLayer,
  dispatch,
  dateTypes,
  dateLabel,
}) => (
  <SidebarComponent
    selectedLayer={selectedLayer}
    dispatch={dispatch}
    dateTypes={dateTypes}
    dateLabel={dateLabel}
  />
);

export default ConnectedWrapper;
