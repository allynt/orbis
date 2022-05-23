import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results.js';
import AssessmentResults from './assessment-results.component';

describe('Assessment Results', () => {
  let formState = null;
  let mockSave = null;
  let mockUpdate = null;
  // TODO: needed?
  const reportGeneratedTimestamp = new Date('2020-01-01T00:00:00.000Z');

  beforeEach(() => {
    formState = { reportGenerated: reportGeneratedTimestamp };
    mockSave = jest.fn();
    mockUpdate = jest.fn();
  });

  it('should render a grid of charts', () => {
    render(
      <AssessmentResults
        impactAssessment={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
        reportGeneratedTimestamp={reportGeneratedTimestamp}
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
        impactAssessment={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
        reportGeneratedTimestamp={reportGeneratedTimestamp}
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
        impactAssessment={RESULTS}
        formState={formState}
        updateAssessment={mockUpdate}
        saveAssessment={mockSave}
        reportGeneratedTimestamp={reportGeneratedTimestamp}
      />,
    );
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('if there is an id, clicking update button calls update function', () => {
    const savedAssessmentResults = {
      property1: 'assessment-property-1',
    };

    const formState = {
      id: 123,
      formStateProperty1: 'formState-property-1',
    };

    const expected = {
      id: 123,
      formStateProperty1: 'formState-property-1',
      reportGenerated: '2020-01-01T00:00:00.000Z',
      impactAssessment: {
        property1: 'assessment-property-1',
      },
    };

    render(
      <AssessmentResults
        impactAssessment={savedAssessmentResults}
        formState={formState}
        updateAssessment={mockUpdate}
        reportGeneratedTimestamp={reportGeneratedTimestamp}
      />,
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    expect(updateButton).toBeInTheDocument();
    userEvent.click(updateButton);

    expect(mockUpdate).toHaveBeenCalledWith(expected);
  });

  it('if there is no id, clicking save button calls save function', async () => {
    const savedAssessmentResults = {
      property1: 'assessment-property-1',
    };

    const formState = {
      formStateProperty1: 'formState-property-1',
    };

    render(
      <AssessmentResults
        impactAssessment={savedAssessmentResults}
        saveAssessment={mockSave}
        reportGeneratedTimestamp={reportGeneratedTimestamp}
        formState={formState}
      />,
    );

    // Save button on results page
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Give mandatory name
    userEvent.type(
      screen.getByRole('textbox', { name: 'Add Name' }),
      'test-name',
    );

    // Save button in yes/no dialog
    const dialogSaveButton = screen.getByTestId('proposal-save-button');

    expect(dialogSaveButton).toBeEnabled();
    userEvent.click(dialogSaveButton);

    const expected = {
      name: 'test-name',
      description: '',
      formStateProperty1: 'formState-property-1',
      reportGenerated: '2020-01-01T00:00:00.000Z',
      impactAssessment: {
        property1: 'assessment-property-1',
      },
    };

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(expected);
    });
  });
});
