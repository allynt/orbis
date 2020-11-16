import React, { useRef } from 'react';

import ReactDom from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, useModal } from '@astrosat/astrosat-ui';

import { useOrbs } from 'map/orbs/useOrbs';
import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  activeCategorisedOrbsAndSourcesSelector,
  activeCategorisedSourcesSelector,
  activeDataSourcesSelector,
  activeLayersSelector,
  categorisedOrbsAndSourcesSelector,
  setLayers,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

import styles from './data-layers.module.css';

const DataLayers = () => {
  const [isVisible, toggle] = useModal(false);
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
    toggle();
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
        <Button theme="link" className={styles.addOrbButton} onClick={toggle}>
          Add/Remove Orbs and Data Layers
        </Button>
      </div>

      {isVisible && ref.current
        ? ReactDom.createPortal(
            <DataLayersDialog
              orbs={categorisedOrbsAndSources}
              initialSelectedSources={selectedLayers}
              onSubmit={handleDialogSubmit}
              close={toggle}
            />,
            document.body,
          )
        : null}
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
