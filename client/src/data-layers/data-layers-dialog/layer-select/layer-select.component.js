import { Button } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React, { useState } from 'react';
import dialogStyles from '../data-layers-dialog.module.css';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import styles from './layer-select.module.css';

/**
 * @param {OrbSources} sources
 * @param {number} level
 * @param {(params: {
 *     source_id: Source['source_id']
 *     selected: boolean}) => void} onSourceChange
 */
const renderCategories = (sources, level, onSourceChange) =>
  // @ts-ignore
  sources.map(source =>
    source.category ? (
      <Accordion
        source={source}
        level={level}
        onSourceChange={onSourceChange}
      />
    ) : (
      <LayerSelectItem
        className={styles.listItem}
        key={source.source_id}
        source={source}
        onChange={onSourceChange}
      />
    ),
  );

const Accordion = ({ source, level, onSourceChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={source.category}>
      <button
        className={clsx(styles.accordionHeader, {
          [styles.accordionHeaderRoot]: level === 0,
        })}
        onClick={() => setOpen(c => !c)}
      >
        {source.category}
      </button>
      <div
        className={styles.accordionContent}
        style={{
          paddingLeft: `${0.5 * (level + 1)}rem`,
          display: open ? 'block' : 'none',
        }}
      >
        {renderCategories(source.sources, level + 1, onSourceChange)}
      </div>
    </React.Fragment>
  );
};

/**
 * @typedef {{
 *   category: string,
 *   sources: {category: string, sources: OrbSources}[] | Source[]
 * }[] | Source[]} OrbSources
 */

/**
 * @param {{
 *   orbSources: OrbSources
 *   selectedSources: Source['source_id'][]
 *   hasMadeChanges?: boolean
 *   onSourceChange: (params: {
 *     source_id: Source['source_id']
 *     selected: boolean}) => void
 *   onAcceptClick: () => void
 * }} props
 */
export const LayerSelect = ({
  orbSources,
  selectedSources,
  hasMadeChanges = false,
  onSourceChange,
  onAcceptClick,
}) => {
  return (
    <div className={styles.layerSelect}>
      <h1 className={dialogStyles.header}>Select Your Layers</h1>
      {orbSources ? (
        <ul className={styles.list}>
          {renderCategories(orbSources, 0, onSourceChange)}
        </ul>
      ) : (
        <p className={styles.noOrbMessage}>
          Select Your Orb in order to find layers
        </p>
      )}
      <Button className={styles.button} disabled={!hasMadeChanges}>
        Confirm
      </Button>
    </div>
  );
};
