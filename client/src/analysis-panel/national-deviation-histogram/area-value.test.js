import React from 'react';

import { render } from '@testing-library/react';

import { AreaValue } from './area-value.component';

describe('<AreaValue />', () => {
  it('Shows the correct label when not aggregated', () => {
    const { getByText } = render(<AreaValue value={1} />);
    expect(getByText(/Value of selected area/)).toBeInTheDocument();
  });

  it('Shows the correct label when aggregated', () => {
    const { getByText } = render(
      <AreaValue value={1} aggregated aggregationLabel="Test" />,
    );
    expect(getByText(/Test of selected areas/)).toBeInTheDocument();
  });
});
