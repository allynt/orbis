import React from 'react';

import { render, screen } from 'test/test-utils';

import AssessmentTable from './assessments-table.component';

const ASSESSMENT_DATA = [
  {
    id: 1,
    name: 'Construct campsite',
    modified: '2000-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Raise Building',
    modified: '2000-01-01T00:42:00.000Z',
  },
];

describe('AssessmentTable', () => {
  let handleEditAssessment = jest.fn();

  it('should show no data message', () => {
    render(
      <AssessmentTable data={[]} handleEditAssessment={handleEditAssessment} />,
    );

    expect(
      screen.getByRole('cell', { name: /no saved assessments/i }),
    ).toBeInTheDocument();
  });

  it('should show data', () => {
    render(
      <AssessmentTable
        data={ASSESSMENT_DATA}
        handleEditAssessment={handleEditAssessment}
      />,
    );

    ASSESSMENT_DATA.forEach(assessment => {
      expect(screen.getByText(assessment.name)).toBeInTheDocument();
    });
  });

  it('should show buttons', () => {
    render(
      <AssessmentTable
        data={ASSESSMENT_DATA}
        handleEditAssessment={handleEditAssessment}
      />,
    );

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
