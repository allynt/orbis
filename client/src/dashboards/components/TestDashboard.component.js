import React from 'react';

const TestDashboard = ({ data }) => (
  <pre style={{ overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
);

export default TestDashboard;
