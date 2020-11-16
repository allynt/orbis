import React from 'react';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

import styles from './layers-list.module.css';

/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: CategorisedSources
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => (
  <>
    {selectedLayers?.map(selectedLayer => {
      if (selectedLayer.category)
        return (
          <>
            <h1 className={styles.category}>{selectedLayer.category}</h1>
            <LayersList
              dispatch={dispatch}
              sidebarComponents={sidebarComponents}
              selectedLayers={selectedLayer.sources}
            />
          </>
        );

      const Component = sidebarComponents?.[selectedLayer.source_id];
      return (
        <LayersListItem
          key={selectedLayer.source_id}
          title={selectedLayer.metadata.label}
        >
          {Component && (
            <React.Suspense fallback={<div>Loading...</div>}>
              {typeof Component === 'function' ? (
                <Component selectedLayer={selectedLayer} dispatch={dispatch} />
              ) : (
                Component
              )}
            </React.Suspense>
          )}
        </LayersListItem>
      );
    })}
  </>
);
