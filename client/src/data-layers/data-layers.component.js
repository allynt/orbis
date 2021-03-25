import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

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

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    '&:hover': {
      borderBottomColor: theme.palette.primary.main,
    },
  },
  button: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: '0 auto',
  },
}));

/**
 * @param {{
 *   sidebarComponents: Record<string, JSX.Element | JSX.Element[]>
 * }} props
 */
const DataLayers = ({ sidebarComponents }) => {
  const styles = useStyles();
  const [isVisible, toggle] = useState(false);

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
    <div className={styles.wrapper}>
      <LayersList
        dispatch={dispatch}
        selectedLayers={activeCategorisedSources}
        sidebarComponents={sidebarComponents}
      />
      <Button
        className={styles.button}
        variant="text"
        size="small"
        onClick={() => toggle(true)}
        startIcon={<AddNewCategoryIcon />}
      >
        <Link className={styles.link} color="textPrimary" component="span">
          Add/Remove Orbs and Data Layers
        </Link>
      </Button>
      <ThemeProvider theme="light">
        <DataLayersDialog
          orbs={categorisedOrbsAndSources}
          initialSelectedSources={selectedLayers}
          onSubmit={handleDialogSubmit}
          close={() => toggle(false)}
          open={isVisible}
        />
      </ThemeProvider>
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
