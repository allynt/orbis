import React, { useState, useEffect } from 'react';

import featureToggles, { enable, disable } from '../persistence';

const Taco = () => {
  const [tacos, setTacos] = useState(featureToggles.tacos);

  useEffect(() => {
    if (tacos) {
      enable('tacos');
    } else {
      disable('tacos');
    }
  }, [tacos]);

  return (
    <div>
      <label>
        Enable Tacos: <input type="checkbox" checked={tacos} onChange={e => setTacos(e.target.checked)} />
      </label>
    </div>
  );
};

export default Taco;
