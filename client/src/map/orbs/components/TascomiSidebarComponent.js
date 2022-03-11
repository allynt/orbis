import React from 'react';

import { SidebarComponent } from './tascomi/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer, dispatch, dateType }) => (
  <SidebarComponent
    selectedLayer={selectedLayer}
    dispatch={dispatch}
    dateType={dateType}
  />
);

export default ConnectedWrapper;
