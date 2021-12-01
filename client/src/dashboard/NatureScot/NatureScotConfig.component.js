import React from 'react';

import { useSelector } from 'react-redux';

import { selectedAoiSelector } from 'data-layers/aoi/aoi.slice';

const NatureScotDashboard = () => {
  const selectedAoi = useSelector(selectedAoiSelector);

  return (
    <div>
      <h1>I am NatureScotDashboard</h1>

      <pre>{JSON.stringify(selectedAoi, null, 2)}</pre>
    </div>
  );
};

export default NatureScotDashboard;
