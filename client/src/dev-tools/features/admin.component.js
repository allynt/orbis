import React, { useState, useEffect } from 'react';

import featureToggles, { enable, disable } from '../persistence';

const Admin = () => {
  const [admin, setAdmin] = useState(featureToggles.admin);

  useEffect(() => {
    if (admin) {
      enable('admin');
    } else {
      disable('admin');
    }
  }, [admin]);

  return (
    <div>
      <label>
        Enable Admin: <input type="checkbox" checked={admin} onChange={e => setAdmin(e.target.checked)} />
      </label>
    </div>
  );
};

export default Admin;
