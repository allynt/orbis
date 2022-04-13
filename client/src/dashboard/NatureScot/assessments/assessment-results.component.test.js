import React from 'react';

import { render, screen } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results.js';
import AssessmentResults from './assessment-results.component';

describe('Assessment Results', () => {
  it('should render a grid of charts', () => {
    render(<AssessmentResults results={RESULTS} />);

    // Chart titles
    expect(
      screen.getByRole('heading', { name: /impact summary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /protected areas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /impact detail by feature/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /info/i }).length).toBe(3);
  });
});
