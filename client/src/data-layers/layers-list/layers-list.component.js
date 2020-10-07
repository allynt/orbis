import React from 'react';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: Source[]
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => (
  <>
    {selectedLayers?.map(selectedLayer => {
      const Component = sidebarComponents?.[selectedLayer.source_id];

      return (
        <LayersListItem
          key={selectedLayer.source_id}
          title={selectedLayer.metadata.label}
        >
          <React.Suspense fallback={<div>Loading...</div>}>
            {typeof Component === 'function' ? (
              <Component selectedLayer={selectedLayer} dispatch={dispatch} />
            ) : (
              Component
            )}
          </React.Suspense>
        </LayersListItem>
      );
    })}
  </>
);
