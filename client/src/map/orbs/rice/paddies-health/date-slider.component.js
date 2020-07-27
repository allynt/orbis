import React from 'react';
import { useSelector } from 'react-redux';

export const DateSlider = () => {
  const dateRange = useSelector(state => state.orbs.rice.dateRange);
  return <div>Current Date Range: {JSON.stringify(dateRange)}</div>;
};
