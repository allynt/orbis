import React from 'react';

import { PldSidebarComponent } from './pld/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const {
    color,
    constructionPhaseFilters,
    developmentTypeFilters,
    iconColor,
  } = selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props;
  return (
    <PldSidebarComponent
      selectedLayer={selectedLayer}
      dispatch={dispatch}
      color={color}
      constructionPhaseFilters={constructionPhaseFilters}
      developmentTypeFilters={developmentTypeFilters}
      iconColor={iconColor}
    />
  );
};

export default ConnectedWrapper;
