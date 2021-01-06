import React, { useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@astrosat/astrosat-ui';

import { useOrbs } from 'map/orbs/useOrbs';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  activeCategorisedSourcesSelector,
  activeLayersSelector,
  categorisedOrbsAndSourcesSelector,
  setLayers,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const [isVisible, toggle] = useState(false);
  const ref = useRef(null);
  const { sidebarComponents } = useOrbs();

  const dispatch = useDispatch();
  const activeCategorisedSources = useSelector(
    activeCategorisedSourcesSelector(1),
  );
  const selectedLayers = useSelector(activeLayersSelector);
  const categorisedOrbsAndSources = useSelector(
    categorisedOrbsAndSourcesSelector(),
  );

  const handleDialogSubmit = sources => {
    dispatch(setLayers(sources));
    toggle(false);
  };

  return (
    <div ref={ref}>
      <LayersList
        dispatch={dispatch}
        selectedLayers={activeCategorisedSources}
        sidebarComponents={sidebarComponents}
      />
      <div className={styles.buttons}>
        <AddNewCategoryIcon
          className={styles.addNewCategoryIcon}
          onClick={toggle}
        />
        <Button
          theme="link"
          className={styles.addOrbButton}
          onClick={() => toggle(true)}
        >
          Add/Remove Orbs and Data Layers
        </Button>
      </div>
      <DataLayersDialog
        orbs={categorisedOrbsAndSources}
        initialSelectedSources={selectedLayers}
        onSubmit={handleDialogSubmit}
        close={() => toggle(false)}
        open={isVisible}
      />
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
