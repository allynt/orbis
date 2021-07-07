import React from 'react';

import { render } from '@testing-library/react';

import SatelliteSearch from './satellite-search.component';

describe('<SatelliteSearch />', () => {
  it("Shows text if there aren't any saved searches", () => {
    const { getByText } = render(<SatelliteSearch />);
    expect(getByText('There are no saved AOI yet')).toBeInTheDocument();
  });

  it('Shows saved searches if there are any', () => {
    const { getAllByRole } = render(
      <SatelliteSearch
        savedSearches={[
          { id: 0, tiers: [] },
          { id: 1, tiers: [] },
        ]}
      />,
    );
    expect(getAllByRole('listitem')).toHaveLength(2);
  });
});
