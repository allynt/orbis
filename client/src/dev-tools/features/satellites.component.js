import React, { useState, useEffect } from 'react';

import featureToggles, { enable, disable } from '../persistence';

const Satellites = () => {
  const [satellites, setSatellites] = useState(featureToggles.satellites);

  useEffect(() => {
    if (satellites) {
      enable('satellites');
    } else {
      disable('satellites');
    }
  }, [satellites]);

  return (
    <div>
      <label>
        Enable Satellites:
        <input
          type="checkbox"
          checked={satellites}
          onChange={e => setSatellites(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default Satellites;
