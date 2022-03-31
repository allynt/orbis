import React from 'react';

import { SidebarComponent } from './tascomi/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer, dispatch, dateType, dateLabel }) => (
  <SidebarComponent
    selectedLayer={selectedLayer}
    dispatch={dispatch}
    dateType={dateType}
    dateLabel={dateLabel}
  />
);

export default ConnectedWrapper;
