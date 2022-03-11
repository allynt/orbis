import React from 'react';

import { render, screen } from 'test/test-utils';

import AssessmentTable from './assessments-table.component';

const ASSESSMENT_DATA = [
  {
    id: 1,
    name: 'Construct campsite',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
  {
    id: 2,
    name: 'Raise Building',
    date: '2000-01-01T00:42:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
  },
];

describe('AssessmentTable', () => {
  it('should show no data message', () => {
    render(<AssessmentTable data={[]} />);

    expect(screen.getByText('No saved Assessments')).toBeInTheDocument();
  });

  it('should show data', () => {
    render(<AssessmentTable data={ASSESSMENT_DATA} />);

    ASSESSMENT_DATA.forEach(assessment => {
      expect(screen.getByText(assessment.name)).toBeInTheDocument();
    });
  });

  it('should show buttons', () => {
    render(<AssessmentTable data={ASSESSMENT_DATA} />);

    const pdfButton = screen.getByRole('button', { name: /export as pdf/i });
    const csvButton = screen.getByRole('button', { name: /export as csv/i });
    expect(pdfButton).toBeInTheDocument();
    expect(pdfButton).toBeDisabled();
    expect(csvButton).toBeInTheDocument();
    expect(csvButton).toBeDisabled();
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });
});
