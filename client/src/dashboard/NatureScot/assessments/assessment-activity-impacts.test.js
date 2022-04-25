import React from 'react';

import { render, screen } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results-legacy';
import AssessmentActivityImpacts from './assessment-activity-impacts';

describe('Assessment Activity Impacts', () => {
  it('should render and display title', () => {
    render(<AssessmentActivityImpacts data={RESULTS?.activities} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/Impact Detail By Activity/i)).toBeInTheDocument();
  });

  it('should render and have display button', () => {
    render(<AssessmentActivityImpacts data={RESULTS?.activities} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/Info/i)).toBeInTheDocument();
  });

  it('should display column headers', () => {
    render(<AssessmentActivityImpacts data={RESULTS?.activities} />);
    expect(screen.getAllByText(/Activity/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/May require consent/i)).toBeInTheDocument();
    expect(screen.getByText(/Biodiversity/i)).toBeInTheDocument();
    expect(screen.getByText(/Chemical/i)).toBeInTheDocument();
    expect(screen.getByText(/People/i)).toBeInTheDocument();
    expect(screen.getByText(/Soil, water, air/i)).toBeInTheDocument();
    expect(screen.getByText(/Environmental/i)).toBeInTheDocument();
    expect(screen.getByText(/Mitigations/i)).toBeInTheDocument();
  });

  it('should display expected values', () => {
    render(<AssessmentActivityImpacts data={RESULTS?.activities} />);
    expect(screen.getAllByText(/Yes/i).length).toBe(1);
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });
});
