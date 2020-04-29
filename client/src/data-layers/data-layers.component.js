import React, { useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { ReactComponent as RemoveIcon } from './remove.svg';
import { ReactComponent as HideIcon } from './layer-invisible.svg';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';

import {
  removeLayer,
  addLayers,
  addFilters,
  selectDataSources,
  selectUserLayers,
  selectAvailableFilters,
  selectCurrentFilters,
} from './data-layers.slice';

import { PopulationInformation } from './population-information.component';
import { HealthInfrastructure } from './health-infrastructure.component';
import DataLayersDialog from './data-layers-dialog.component';

import styles from './data-layers.module.css';
import { Filters } from './filters/filters.component';

const DefaultComponent = ({ selectedLayer, dispatch }) => (
  <div>
    {selectedLayer.metadata.range && (
      <Slider min={0} max={10} values={[1, 7]} onChange={() => console.log('Slider changed')} />
    )}

    <div className={styles.buttons}>
      <Button theme="primary" classNames={[styles.button]} onClick={() => console.log('Toggle Show/Hide Layer')}>
        <HideIcon className={styles.icon} />
      </Button>
      <Button theme="primary" classNames={[styles.button]} onClick={() => dispatch(removeLayer(selectedLayer))}>
        <RemoveIcon className={styles.icon} />
      </Button>
    </div>
  </div>
);

const detailComponentMap = {
  'population-information': PopulationInformation,
  infrastructure: HealthInfrastructure,
  default: DefaultComponent,
};

const DataLayers = () => {
  const [isVisible, toggle] = useModal(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const dataSources = useSelector(selectDataSources);
  const selectedLayers = useSelector(selectUserLayers);
  const availableFilters = useSelector(selectAvailableFilters);
  const currentFilters = useSelector(selectCurrentFilters);
  const canFilter = availableFilters !== undefined && availableFilters !== null && !isEmpty(availableFilters);

  // Create an array of sources, grouped by their domain.
  const domains = dataSources.reduce((acc, value) => {
    const domain = acc.find(dom => dom.label === value.metadata.domain);

    domain
      ? (domain.layers = [...domain.layers, value])
      : (acc = [...acc, { label: value.metadata.domain, layers: [value] }]);

    return acc;
  }, []);

  const handleFiltersChange = (toAdd, toRemove) => {
    dispatch(addFilters(toAdd));
    console.log(toRemove);
  };

  return (
    <div className={styles.selectData} ref={ref}>
      {canFilter && (
        <Filters
          availableFilters={availableFilters}
          currentFilters={currentFilters}
          onFiltersChange={handleFiltersChange}
        />
      )}
      <div className={styles.layers}>
        {selectedLayers.map(selectedLayer => {
          const Component = detailComponentMap[selectedLayer.name] ?? detailComponentMap['default'];
          return (
            <Detail key={selectedLayer.name} title={selectedLayer.metadata.label}>
              <div className={styles.detailContent}>
                <Component selectedLayer={selectedLayer} dispatch={dispatch} />
              </div>
            </Detail>
          );
        })}
      </div>

      <div className={styles.buttons}>
        <AddNewCategoryIcon className={styles.addNewCategoryIcon} onClick={toggle} />
        <Button theme="link" className={styles.addOrbButton} onClick={toggle}>
          Add New Orb
        </Button>
      </div>

      <DataLayersDialog
        domains={domains}
        selectedLayers={selectedLayers}
        onAddLayers={selectedLayers => dispatch(addLayers(selectedLayers))}
        onRemoveLayer={layer => dispatch(removeLayer(layer))}
        isVisible={isVisible}
        close={toggle}
        ref={ref}
      ></DataLayersDialog>
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
