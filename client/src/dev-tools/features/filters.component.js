import React, { useState, useEffect } from 'react';

import featureToggles, { enable, disable } from '../persistence';

const Filters = () => {
  const [filters, setFilters] = useState(featureToggles.filters);

  useEffect(() => {
    if (filters) {
      enable('filters');
    } else {
      disable('filters');
    }
  }, [filters]);

  return (
    <div>
      <label>
        Enable Filters:{' '}
        <input
          type="checkbox"
          checked={filters}
          onChange={e => setFilters(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default Filters;
