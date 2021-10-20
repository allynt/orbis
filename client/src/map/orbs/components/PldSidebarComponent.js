import React from 'react';

import { PldSidebarComponent } from './pld/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer }) => (
  <PldSidebarComponent
    selectedLayer={selectedLayer}
    color={
      selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props
        ?.color
    }
    constructionPhaseFilters={
      selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props
        ?.constructionPhaseFilters
    }
    developmentTypeFilters={
      selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props
        ?.developmentTypeFilters
    }
    iconColor={
      selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props
        ?.iconColor
    }
  />
);

export default ConnectedWrapper;
