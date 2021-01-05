import React, { useEffect, useState } from 'react';

import { isEqual } from 'lodash';

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

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      PaperProps={{ className: styles.dialog }}
      open={open}
      onClose={close}
    >
      <IconButton size="small" className={styles.closeButton} onClick={close}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <div className={styles.content}>
        <OrbSelect
          orbs={orbs}
          onOrbClick={setSelectedOrbName}
          selectedOrbName={selectedOrbName}
        />
        <LayerSelect
          orbSources={orbs?.find(orb => orb.name === selectedOrbName)?.sources}
          selectedSources={selectedSources}
          onSourcesChange={handleSourcesChange}
          onSubmit={handleSubmit}
          hasMadeChanges={hasMadeChanges}
        />
      </div>
    </Dialog>
  );
};

export default DataLayersDialog;
