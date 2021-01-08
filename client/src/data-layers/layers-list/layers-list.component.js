import * as React from 'react';

import { styled, Typography, fade } from '@astrosat/astrosat-ui';

import { LayersListItem } from './layers-list-item/layers-list-item.component';

const CategoryHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
  backgroundColor: fade(theme.palette.common.white, 0.17),
  padding: '0.75rem 1rem',
}));

/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: import('typings/orbis').CategorisedSources
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => (
  <>
    {selectedLayers?.map(selectedLayer => {
      if (selectedLayer.category)
        return (
          <>
            <CategoryHeader>{selectedLayer.category}</CategoryHeader>
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
