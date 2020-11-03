import { Button } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';
import dialogStyles from '../data-layers-dialog.module.css';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import styles from './layer-select.module.css';

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
  /**
   * @param {OrbSources} sources
   * @param {number} level
   */
  const renderCategories = (sources, level) =>
    // @ts-ignore
    sources.map(source =>
      source.category ? (
        <React.Fragment key={source.category}>
          <button
            className={clsx(styles.accordionHeader, {
              [styles.accordionHeaderRoot]: level === 0,
            })}
          >
            {source.category}
          </button>
          <div
            className={styles.accordionContent}
            style={{ paddingLeft: `${0.5 * (level + 1)}rem` }}
          >
            {source.sources.map(source =>
              renderCategories([source], level + 1),
            )}
          </div>
        </React.Fragment>
      ) : (
        <LayerSelectItem
          className={styles.listItem}
          key={source.source_id}
          source={source}
          onChange={onSourceChange}
        />
      ),
    );

  return (
    <div className={styles.layerSelect}>
      <h1 className={dialogStyles.header}>Select Your Layers</h1>
      {orbSources ? (
        <ul className={styles.list}>{renderCategories(orbSources, 0)}</ul>
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
