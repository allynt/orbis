import React, { useState } from 'react';

import { Checkbox, InfoButton } from '@astrosat/astrosat-ui';

import InfoBox from 'components/info-box/info-box.component';
import { useClickaway } from 'hooks/useClickaway';

/**
 * @param {{
 *   source: Source
 *   selected?: boolean
 *   onChange: ({source_id: string, selected: boolean}) => void
 * }} props
 */
const LayerSelectItem = ({ source, selected, onChange }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [infoRef] = useClickaway(() => setIsInfoVisible(false));

  const buttonClick = () => {
    setIsInfoVisible(c => !c);
  };

  return (
    <li>
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
      <div ref={infoRef}>
        {isInfoVisible && (
          <InfoBox arrow="right">{source.metadata.description}</InfoBox>
        )}
        <InfoButton onClick={buttonClick} />
      </div>
    </li>
  );
};

export default LayerSelectItem;
