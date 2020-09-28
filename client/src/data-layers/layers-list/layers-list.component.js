import React, { lazy, useEffect, useState } from 'react';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

import styles from '../data-layers.module.css';

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
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers }) => {
  const [sidebarComponents, setSidebarComponents] = useState({});

  useEffect(() => {
    const loadComponents = async () => {
      const componentPromises = selectedLayers.map(source => {
        const Component = lazy(() =>
          import(`./components/${source.metadata.sidebar_component}`),
        );
        return [source.source_id, <Component />];
      });
      Promise.all(componentPromises).then(components =>
        setSidebarComponents(
          components.reduce(
            (acc, [source_id, component]) => ({
              ...acc,
              [source_id]: component,
            }),
            {},
          ),
        ),
      );
    };
    loadComponents();
  }, [selectedLayers, dispatch]);

  return (
    <>
      {selectedLayers?.map(selectedLayer => {
        const Component = sidebarComponents?.[selectedLayer.source_id];

        return (
          <LayersListItem
            key={selectedLayer.source_id}
            title={selectedLayer.metadata.label}
          >
            <React.Suspense
              // key={Component.name}
              fallback={<div>Loading...</div>}
            >
              {Component}
            </React.Suspense>
          </LayersListItem>
        );
      })}
    </>
  );
};
