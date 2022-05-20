import React from 'react';

import { render, screen, userEvent, within } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results.js';
import AssessmentResults from './assessment-results.component';

describe('Assessment Results', () => {
  let formState = {};
  const mockSave = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    formState = { reportGenerated: '2020-01-01T00:00:00.000Z' };
  });

  it('should render a grid of charts', () => {
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
      />,
    );

    // Chart titles
    expect(
      screen.getByRole('heading', { name: /impact summary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /protected areas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /Impact Details By Feature/i }),
    ).toBeInTheDocument();

    // TODO: toHaveLength()
    expect(screen.getAllByRole('button', { name: /info/i }).length).toBe(4);
  });

  it('should render button as save if no id', () => {
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
      />,
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should render button as save if no id', () => {
    formState = {
      ...formState,
      id: 'this_should_be_a_GUID_added_by_django',
    };
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
      />,
    );
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('if there is an id, clicking update button calls update function', () => {
    const mockUpdateAssessment = jest.fn(),
      formState = {
        id: 'this_should_be_a_GUID_added_by_django',
        reportGenerated: '2020-01-01T00:00:00.000Z',
      };

    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdateAssessment}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).toBeInTheDocument();
    userEvent.click(updateButton);

    expect(mockUpdateAssessment).toHaveBeenCalledWith(formState);
  });

  it.only('if there is no id, clicking save button calls save function', () => {
    const mockSaveAssessment = jest.fn();

    render(
      <AssessmentResults
        timestamp={new Date()}
        results={RESULTS}
        saveAssessment={mockSaveAssessment}
        formState={{
          reportGenerated: '2020-01-01T00:00:00.000Z',
        }}
      />,
    );

    // Save button on results page
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Save button in yes/no dialog
    const dialogSaveButton = screen.getByTestId('proposal-save-button');

    expect(dialogSaveButton).toBeInTheDocument();
    userEvent.click(dialogSaveButton);

    const expected = {};

    expect(mockSaveAssessment).toHaveBeenCalled();
  });
});
