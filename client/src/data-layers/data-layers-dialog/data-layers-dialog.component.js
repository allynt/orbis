import React, { useEffect, useState } from 'react';

import {
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { isEqual } from 'lodash';

import { createOrbsWithCategorisedSources } from 'data-layers/categorisation.utils';

import { LayerSelect } from './layer-select/layer-select.component';
import { OrbSelect } from './orb-select/orb-select.component';

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
 *   sources: import('typings').Source[]
 *   initialSelectedSources?: import('typings').Source['source_id'][]
 *   initialSelectedCrossFilterProperties?: object[]
 *   open?: boolean
 *   isCrossFilteringMode?: boolean,
 *   close: () => void
 *   onSubmit: (sources: import('typings').Source['source_id'][]) => void
 * }} props
 */
const DataLayersDialog = ({
  sources,
  initialSelectedSources = [],
  initialSelectedCrossFilterProperties = [],
  isCrossFilteringMode,
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
  const [selectedCrossFilterProperties, setSelectedCrossFilterProperties] =
    useState(initialSelectedCrossFilterProperties);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  useEffect(() => {
    const comparison = isCrossFilteringMode
      ? !isEqual(
          initialSelectedCrossFilterProperties,
          selectedCrossFilterProperties,
        )
      : !isEqual(initialSelectedSources, selectedSources);
    setHasMadeChanges(comparison);
  }, [
    initialSelectedSources,
    selectedSources,
    initialSelectedCrossFilterProperties,
    selectedCrossFilterProperties,
    isCrossFilteringMode,
  ]);

  /** @param {{source_ids: import('typings').Source['source_id'][], selected: boolean}} params */
  const handleSourcesChange = ({ source_ids, selected }) => {
    selected
      ? setSelectedSources(current => [...current, ...source_ids])
      : setSelectedSources(current =>
          current.filter(v => !source_ids.includes(v)),
        );
  };

  /** @param {{properties: object[], selected: boolean, source: import('typings').Source}} params */
  const handleCrossFilterPropertiesChange = ({
    properties,
    selected,
    source,
  }) => {
    if (selected) {
      setSelectedCrossFilterProperties(current => [...current, ...properties]);
    } else {
      setSelectedCrossFilterProperties(current => {
        // filter current list, to find if any properties are still selected
        const filtered = current.filter(
          v => !properties.find(p => p.name === v.name),
        );

        // If none are selected, then de-select the source as well.
        if (filtered.length === 0) {
          handleSourcesChange({
            source_ids: [source.source_id],
            selected: false,
          });
        }

        return filtered;
      });
    }
  };

  const handleSubmit = () =>
    onSubmit &&
    onSubmit(
      isCrossFilteringMode ? selectedCrossFilterProperties : selectedSources,
    );

  const handleClose = () => {
    setSelectedOrbName(undefined);
    setSelectedSources(initialSelectedSources);
    close();
  };

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
          orbs={createOrbsWithCategorisedSources(
            sources,
            undefined,
            false,
            isCrossFilteringMode,
          )}
          onOrbClick={orbName => setSelectedOrbName(orbName)}
          selectedOrbName={selectedOrbName}
        />
        <LayerSelect
          sources={sources}
          selectedSources={selectedSources}
          selectedCrossFilterProperties={selectedCrossFilterProperties}
          selectedOrbName={selectedOrbName}
          isCrossFilteringMode={isCrossFilteringMode}
          onSourcesChange={handleSourcesChange}
          onCrossFilterPropertiesChange={handleCrossFilterPropertiesChange}
          onSubmit={handleSubmit}
          hasMadeChanges={hasMadeChanges}
        />
      </div>
    </Dialog>
  );
};

export default DataLayersDialog;
