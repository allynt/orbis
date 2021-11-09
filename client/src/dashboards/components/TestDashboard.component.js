import React from 'react';

const TestDashboard = ({ data }) => (
  <pre data-testid="test-dashboard" style={{ overflow: 'auto' }}>
    {JSON.stringify(data, null, 2)}
  </pre>
);

export default TestDashboard;
