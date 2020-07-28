import React from 'react';

import { Slider, Button } from '@astrosat/astrosat-ui';

import { PopulationInformation } from '../population-information.component';
import { HealthInfrastructure } from '../health-infrastructure.component';

import { ReactComponent as RemoveIcon } from '../remove.svg';
import { ReactComponent as HideIcon } from '../layer-invisible.svg';

import styles from '../data-layers.module.css';
import { removeLayer } from 'data-layers/data-layers.slice';
import { LayersListItem } from './layers-list-item/layers-list-item.component';

const DefaultComponent = ({ selectedLayer, dispatch }) => (
  <div>
    {selectedLayer.metadata.range && (
      <Slider
        min={0}
        max={10}
        values={[1, 7]}
        onChange={() => console.log('Slider changed')}
      />
    )}

    <div className={styles.buttons}>
      <Button
        theme="primary"
        classNames={[styles.button]}
        onClick={() => console.log('Toggle Show/Hide Layer')}
      >
        <HideIcon className={styles.icon} />
      </Button>
      <Button
        theme="primary"
        classNames={[styles.button]}
        onClick={() => dispatch(removeLayer(selectedLayer))}
      >
        <RemoveIcon className={styles.icon} />
      </Button>
    </div>
  </div>
);

const detailComponentMap = {
  hourglass: PopulationInformation,
  infrastructure: HealthInfrastructure,
  default: DefaultComponent,
};

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
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers }) => (
  <div className={styles.layers}>
    {selectedLayers?.map(selectedLayer => {
      // We need to have structure to our layer naming for this to work,
      // but if we prepend each layer with it's type, e.g `scotish-infrastructure` becomes `infrastructure` and `people`,
      // remains `people`.
      const [layerType] = selectedLayer.name.split('-').slice(-1);
      const Component =
        detailComponentMap[layerType ? layerType : selectedLayer.name] ??
        detailComponentMap['default'];

      return (
        <LayersListItem
          key={selectedLayer.source_id}
          title={selectedLayer.metadata.label}
        >
          <Component selectedLayer={selectedLayer} dispatch={dispatch} />
        </LayersListItem>
      );
    })}
  </div>
);
