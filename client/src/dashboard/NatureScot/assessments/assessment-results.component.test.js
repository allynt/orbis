import React from 'react';

import { render, screen } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results.js';
import AssessmentResults from './assessment-results.component';

describe('Assessment Results', () => {
  it('should render a grid of charts', () => {
    const formState = { reportGenerated: '2020-01-01T00:00:00.000Z' };
    render(<AssessmentResults results={RESULTS} formState={formState} />);

    // Chart titles
    expect(
      screen.getByRole('heading', { name: /impact summary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /protected areas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Impact Detail By Activity/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /info/i }).length).toBe(3);
  });
});
