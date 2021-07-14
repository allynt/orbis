import React from 'react';

import { render } from '@testing-library/react';

import SatelliteSearch from './search.component';

describe('<SatelliteSearch />', () => {
  it('Renders', () => {
    render(<SatelliteSearch />);
  });
});
