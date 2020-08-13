import React, { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, useModal } from '@astrosat/astrosat-ui';

import { useOrbs } from 'map/orbs/useOrbs';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  activeDataSourcesSelector,
  addLayers,
  dataSourcesSelector,
  removeLayer,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const { sidebarComponents } = useOrbs();
  const [isVisible, toggle] = useModal(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const dataSources = useSelector(dataSourcesSelector);
  const selectedLayers = useSelector(activeDataSourcesSelector);

  // Create an array of sources, grouped by their domain.
  const domains = dataSources.reduce((acc, value) => {
    const domain = acc.find(dom => dom.label === value.metadata.domain);

    domain
      ? (domain.layers = [...domain.layers, value])
      : (acc = [...acc, { label: value.metadata.domain, layers: [value] }]);

    return acc;
  }, []);

  return (
    <div className={styles.selectData} ref={ref}>
      <LayersList
        dispatch={dispatch}
        selectedLayers={selectedLayers}
        sidebarComponents={sidebarComponents}
      />
      <div className={styles.buttons}>
        <AddNewCategoryIcon
          className={styles.addNewCategoryIcon}
          onClick={toggle}
        />
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
