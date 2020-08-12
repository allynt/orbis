import React from 'react';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

import styles from '../data-layers.module.css';

/**
 * @typedef Layer
 * @property {string} name
 * @property {string} source_id
 * @property {{ label: string }} metadata
 */
/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: Layer[]
 *   sidebarComponents: { [key: string]: React.Component }
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
          {Component ? (
            <Component selectedLayer={selectedLayer} dispatch={dispatch} />
          ) : null}
        </LayersListItem>
      );
    })}
  </>
);
