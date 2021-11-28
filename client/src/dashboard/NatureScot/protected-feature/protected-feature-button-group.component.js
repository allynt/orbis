import React from 'react';

import { ToggleButton, ToggleButtonGroup } from '@astrosat/astrosat-ui';

const ProtectedFeatureButtonGroup = ({ buttons, onSubmit }) => {
  const handleChange = (event, value) => onSubmit(value);

  return (
    <ToggleButtonGroup exclusive onChange={handleChange}>
      {buttons.map(({ label }) => {
        return (
          <ToggleButton key={label} value={label}>
            {label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default ProtectedFeatureButtonGroup;
