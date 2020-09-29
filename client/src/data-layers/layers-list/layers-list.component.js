import React from 'react';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

/**
 * @typedef Layer
 * @property {string} name
 * @property {string} source_id
 * @property {{ label: string, sidebar_component: string }} metadata
 */
/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: Layer[]
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => {
  return (
    <>
      {selectedLayers?.map(selectedLayer => {
        const Component = sidebarComponents?.[selectedLayer.source_id];

        return (
          <LayersListItem
            key={selectedLayer.source_id}
            title={selectedLayer.metadata.label}
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              {Component}
            </React.Suspense>
          </LayersListItem>
        );
      })}
    </>
  );
};
