import React, { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, useModal } from '@astrosat/astrosat-ui';

import { useOrbs } from 'map/orbs/useOrbs';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  activeDataSourcesSelector,
  activeLayersSelector,
  categorisedSourcesSelector,
  setLayers,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const [isVisible, toggle] = useModal(false);
  const ref = useRef(null);
  const { sidebarComponents } = useOrbs();

  const dispatch = useDispatch();
  const activeDataSources = useSelector(activeDataSourcesSelector);
  const selectedLayers = useSelector(activeLayersSelector);
  const categorisedOrbsAndSources = useSelector(categorisedSourcesSelector);

  return (
    <div className={styles.selectData} ref={ref}>
      <LayersList
        dispatch={dispatch}
        selectedLayers={activeDataSources}
        sidebarComponents={sidebarComponents}
      />
      <div className={styles.buttons}>
        <AddNewCategoryIcon
          className={styles.addNewCategoryIcon}
          onClick={toggle}
        />
        <Button theme="link" className={styles.addOrbButton} onClick={toggle}>
          Add/Remove Orbs and Data Layers
        </Button>
      </div>

      <DataLayersDialog
        orbs={categorisedOrbsAndSources}
        initialSelectedSources={selectedLayers}
        onSubmit={layers => dispatch(setLayers(layers))}
        isVisible={isVisible}
        close={toggle}
        ref={ref}
      />
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
