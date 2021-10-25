import * as React from 'react';

import { styled, Typography, alpha } from '@astrosat/astrosat-ui';

import { SidePanelSection } from 'components';

const CategoryHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  backgroundColor: alpha(theme.palette.common.white, 0.17),
  padding: '0.75rem 1rem',
}));

/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: import('typings').CategorisedSources
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => (
  <>
    {selectedLayers?.map((selectedLayer, i) => {
      if (selectedLayer.category)
        return (
          <React.Fragment key={`${selectedLayer.category}-${i}`}>
            <CategoryHeader>{selectedLayer.category}</CategoryHeader>
            <LayersList
              dispatch={dispatch}
              sidebarComponents={sidebarComponents}
              selectedLayers={selectedLayer.sources}
            />
          </React.Fragment>
        );

      const Component = sidebarComponents?.[selectedLayer.source_id];
      return (
        <SidePanelSection
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
        </SidePanelSection>
      );
    })}
  </>
);
