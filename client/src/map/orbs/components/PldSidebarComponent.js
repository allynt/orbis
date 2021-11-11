import React from 'react';

import { PldSidebarComponent } from './pld/sidebar/sidebar.component';

const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const {
    color,
    constructionPhaseFilters,
    developmentTypeFilters,
    iconColor,
    minFilterDate,
    maxFilterDate,
  } = selectedLayer?.metadata?.application?.orbis?.sidebar_component?.props;
  return (
    <PldSidebarComponent
      selectedLayer={selectedLayer}
      dispatch={dispatch}
      color={color}
      minFilterDate={minFilterDate}
      maxFilterDate={maxFilterDate}
      constructionPhaseFilters={constructionPhaseFilters}
      developmentTypeFilters={developmentTypeFilters}
      iconColor={iconColor}
    />
  );
};

export default ConnectedWrapper;
