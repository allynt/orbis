import React, { useState } from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoBox, InfoButton } from 'components';
import { useClickaway } from 'hooks/useClickaway';

import styles from './layer-select-item.module.css';

/**
 * @param {{
 *   source: Source
 *   selected?: boolean
 *   className?: string
 *   onChange: ({source_id: string, selected: boolean}) => void
 * }} props
 */
const LayerSelectItem = ({ source, selected, className, onChange }) => {
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
        defaultChecked={selected}
        onChange={
          /** @param {React.ChangeEvent<HTMLInputElement>} e */
          e =>
            onChange({
              source_id: source.source_id,
              selected: e.target.checked,
            })
        }
      />
      <div className={styles.info} ref={infoRef}>
        {isInfoVisible && (
          <InfoBox className={styles.infoBox} arrow="right">
            {source.metadata.description}
          </InfoBox>
        )}
        <InfoButton className={styles.infoButton} onClick={buttonClick} />
      </div>
    </li>
  );
};

export default LayerSelectItem;
