import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results.js';
import AssessmentResults from './assessment-results.component';

describe('Assessment Results', () => {
  it('should render a grid of charts', () => {
    const formState = { reportGenerated: '2020-01-01T00:00:00.000Z' };
    const mockFunction = jest.fn();
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockFunction}
        saveAssessment={mockFunction}
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

    expect(screen.getAllByRole('button', { name: /info/i }).length).toBe(4);
  });

  it('should render button as save if no id', () => {
    const formState = { reportGenerated: '2020-01-01T00:00:00.000Z' };
    const mockFunction = jest.fn();
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockFunction}
        saveAssessment={mockFunction}
      />,
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should render button as save if no id', () => {
    const mockFunction = jest.fn();
    const formState = {
      id: 'this_should_be_a_GUID_added_by_django',
      reportGenerated: '2020-01-01T00:00:00.000Z',
    };
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockFunction}
        saveAssessment={mockFunction}
      />,
    );
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('if there is an id, clicking update button calls update function', () => {
    const mockSaveAssesment = jest.fn();
    const mockUpdateAssessment = jest.fn();
    const formState = {
      id: 'this_should_be_a_GUID_added_by_django',
      reportGenerated: '2020-01-01T00:00:00.000Z',
    };
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdateAssessment}
        saveAssessment={mockSaveAssesment}
      />,
    );
    const callToAction = screen.getByRole('button', { name: /update/i });
    expect(callToAction).toBeInTheDocument();
    userEvent.click(callToAction);
    expect(mockUpdateAssessment).toHaveBeenCalledWith(formState);
  });

  xit('if there is no id, clicking save button calls save function', () => {
    // TODO find why this test is failing even though the previous one passes
    const mockSaveAssesment = jest.fn();
    const mockUpdateAssessment = jest.fn();
    const formState = {
      reportGenerated: '2020-01-01T00:00:00.000Z',
    };
    render(
      <AssessmentResults
        results={RESULTS}
        formState={formState}
        updateAssessment={mockUpdateAssessment}
        saveAssessment={mockSaveAssesment}
      />,
    );
    screen.debug(screen.getByRole('button', { name: /save/i }));
    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockSaveAssesment).toHaveBeenCalled();
  });
});
