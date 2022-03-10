import React from 'react';

import { SidebarComponent } from './tascomi/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer, dispatch }) => (
  <SidebarComponent selectedLayer={selectedLayer} dispatch={dispatch} />
);

export default ConnectedWrapper;
