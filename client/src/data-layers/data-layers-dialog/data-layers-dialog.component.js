import React, { useEffect, useState } from 'react';

import { isEqual } from 'lodash';

import { createOrbsWithCategorisedSources } from 'data-layers/categorisation.utils';

import {
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { OrbSelect } from './orb-select/orb-select.component';
import { LayerSelect } from './layer-select/layer-select.component';

const useStyles = makeStyles(theme => ({
  dialog: { borderRadius: '1rem', height: '70%' },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  content: {
    display: 'flex',
    height: '100%',
  },
}));

/**
 * @param {{
 *   orbs: import('typings/orbis').OrbWithCategorisedSources[]
 *   initialSelectedSources?: import('typings/orbis').Source['source_id'][]
 *   open?: boolean
 *   close: () => void
 *   onSubmit: (sources: import('typings/orbis').Source['source_id'][]) => void
 * }} props
 */
const DataLayersDialog = ({
  orbs,
  initialSelectedSources = [],
  open = false,
  close,
  onSubmit,
}) => {
  const styles = useStyles();
  /** @type {[string, React.Dispatch<string>]} */
  const [selectedOrbName, setSelectedOrbName] = useState();
  const [selectedSources, setSelectedSources] = useState(
    initialSelectedSources,
  );
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  const [sources, setSources] = useState(undefined);

  useEffect(() => {
    setHasMadeChanges(!isEqual(initialSelectedSources, selectedSources));
  }, [initialSelectedSources, selectedSources]);

  /** @param {{source_ids: import('typings/orbis').Source['source_id'][], selected: boolean}} params */
  const handleSourcesChange = ({ source_ids, selected }) => {
    selected
      ? setSelectedSources(current => [...current, ...source_ids])
      : setSelectedSources(current =>
          current.filter(v => !source_ids.includes(v)),
        );
  };

  const handleSubmit = () => onSubmit && onSubmit(selectedSources);

  const handleClose = () => {
    setSelectedOrbName(undefined);
    setSelectedSources(initialSelectedSources);
    close();
  };

  const handleSearchChange = e => {
    const filteredSources = orbs?.filter(source =>
      source.metadata.label.match(new RegExp(e.target.value, 'i')),
    );

    const test = createOrbsWithCategorisedSources(filteredSources)?.find(
      orb => orb.name === selectedOrbName,
    )?.sources;

    setSources(test);
  };

  const categorisedOrbs = orbs && createOrbsWithCategorisedSources(orbs);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      PaperProps={{ className: styles.dialog }}
      open={open}
      onClose={handleClose}
    >
      <IconButton
        size="small"
        className={styles.closeButton}
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <div className={styles.content}>
        <OrbSelect
          orbs={categorisedOrbs}
          onOrbClick={setSelectedOrbName}
          selectedOrbName={selectedOrbName}
        />
        <LayerSelect
          orbSources={
            sources
              ? sources
              : categorisedOrbs?.find(orb => orb.name === selectedOrbName)
                  ?.sources
          }
          selectedSources={selectedSources}
          onSourcesChange={handleSourcesChange}
          onSearchChange={handleSearchChange}
          onSubmit={handleSubmit}
          hasMadeChanges={hasMadeChanges}
        />
      </div>
    </Dialog>
  );
};

export default DataLayersDialog;
