import React, { useState } from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoBox, InfoButton } from 'components';
import { useClickaway } from 'hooks/useClickaway';

import styles from './layer-select-item.module.css';

/**
 * @param {{
 *   className?: string
 *   selected?: boolean
 *   source: Source
 *   onChange: (params: {source_ids: Source['source_id'][]; selected: boolean}) => void
 * }} props
 */
const LayerSelectItem = ({ className, selected, source, onChange }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [infoRef] = useClickaway(() => setIsInfoVisible(false));

  const buttonClick = () => {
    setIsInfoVisible(c => !c);
  };

  return (
    <li className={clsx(styles.li, className)}>
      <Checkbox
        id={source.source_id}
        label={source.metadata.label}
        checked={selected}
        onChange={e =>
          onChange({
            source_ids: [source.source_id],
            selected: e.target.checked,
          })
        }
      />
      {source?.metadata?.description && (
        <div className={styles.info} ref={infoRef}>
          {isInfoVisible && (
            <InfoBox className={styles.infoBox} arrow="right">
              {source.metadata.description}
            </InfoBox>
          )}
          <InfoButton className={styles.infoButton} onClick={buttonClick} />
        </div>
      )}
    </li>
  );
};

export default LayerSelectItem;
