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
    sources.map(source =>
      source.category ? (
        <div key={source.category}>
          <button>{source.category}</button>
          <>
            {source.sources.map(source =>
              renderCategories([source], level + 1),
            )}
          </>
        </div>
      ) : (
        <LayerSelectItem
          key={source.source_id}
          source={source}
          onChange={onSourceChange}
        />
      ),
    );

  return (
    <div className={styles.subcategories}>
      <div className={dialogStyles.header}>
        <h3>Select Your Layers</h3>
      </div>
      {orbSources ? (
        renderCategories(orbSources, 0)
      ) : (
        <p>Select Your Orb in order to find layers</p>
      )}
      <div className={dialogStyles.buttons}>
        <Button className={clsx(styles.addButton)} disabled={!hasMadeChanges}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
