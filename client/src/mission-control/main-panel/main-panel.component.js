import React from 'react';

import { VIEWS } from '../mission-control.constants';
import HomeView from './main-panel-views/home-view/home-view.component';

export const MainPanel = ({ mainPanelView }) => {
  switch (mainPanelView) {
    case VIEWS.users:
      return <HomeView />;
    case VIEWS.other:
      return <h1>I am another view</h1>;
    default:
      return undefined;
  }
};
