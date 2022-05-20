import React from 'react';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import AssessmentDialog from './assessment-dialog.component';

const initialState = {
  description: '',
  startDate: null,
  endDate: null,
  reportGenerated: null,
  activities: [],
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [0, 0],
      ],
    ],
  },
};

describe('AssessmentDialog', () => {
  let close = null;
  let onSubmit = null;

  beforeEach(() => {
    close = jest.fn();
    onSubmit = jest.fn();
  });

  it('should not show the dialog', () => {
    render(
      <AssessmentDialog
        open={false}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
      />,
    );

    expect(
      screen.queryByRole('heading', {
        name: /Welcome to the Impact Assessment functionality for Eco-an-Alba./i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /run impact assessment/i }),
    ).not.toBeInTheDocument();
  });

  it('should show the dialog', () => {
    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
        formState={initialState}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: /Welcome to the Impact Assessment functionality for Eco-an-Alba./i,
      }),
    ).toBeInTheDocument();

    // Verify tab list
    expect(screen.getByRole('tablist')).toBeInTheDocument();

    // 3 tab navigation
    expect(screen.getAllByRole('tab').length).toBe(2);

    // Only one panel visible.
    expect(screen.getAllByRole('tabpanel').length).toBe(1);

    expect(
      screen.getByRole('button', { name: /run impact assessment/i }),
    ).toBeInTheDocument();
  }, 60000);

  it('should enable the `run impact assessment` button', async () => {
    const state = {
      natureScotDashboard: {
        availableActivities: [
          { title: 'Test Activity 1', code: 'activity1' },
          { title: 'Test Activity 2', code: 'activity2' },
        ],
      },
    };

    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
        formState={initialState}
      />,
      { state },
    );

    userEvent.type(
      screen.getByTestId('description').firstChild,
      'build something',
    );

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const date = `${day}/${month + 1}/${year}`;
    userEvent.type(screen.getByRole('textbox', { name: /start date/i }), date);
    userEvent.type(screen.getByRole('textbox', { name: /end date/i }), date);

    expect(
      screen.getByRole('group', { name: /select activities/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /run impact assessment/i }),
    ).toBeDisabled();

    await waitFor(() =>
      userEvent.click(
        screen.getByRole('listitem', { name: 'Test Activity 2' }),
      ),
    );

    userEvent.click(screen.getByTestId('choose-activity'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /run impact assessment/i }),
      ).toBeEnabled(),
    );
  }, 70000);

  it('should submit the form when the `run impact assessment` button is enabled and clicked', async () => {
    const state = {
      natureScotDashboard: {
<<<<<<< HEAD
        availableActivities: [
=======
        activities: [
>>>>>>> 1220-rory-tests
          { title: 'Test Activity 1', code: 'activity1' },
          { title: 'Test Activity 2', code: 'activity2' },
        ],
      },
    };

    const selectedAoi = {
      name: 'Test AOI',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      },
    };

    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
        formState={{ ...initialState, geometry: selectedAoi.geometry }}
      />,
      { state },
    );

    userEvent.type(
      screen.getByTestId('description').firstChild,
      'build something',
    );

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const date = `${day}/${month + 1}/${year}`;
    userEvent.type(screen.getByRole('textbox', { name: /start date/i }), date);
    userEvent.type(screen.getByRole('textbox', { name: /end date/i }), date);

    expect(
      screen.getByRole('group', { name: /select activities/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /run impact assessment/i }),
    ).toBeDisabled();

    await waitFor(() =>
      userEvent.click(
        screen.getByRole('listitem', { name: 'Test Activity 2' }),
      ),
    );
    userEvent.click(screen.getByTestId('choose-activity'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /run impact assessment/i }),
      ).toBeEnabled(),
    );

    userEvent.click(
      screen.getByRole('button', { name: /run impact assessment/i }),
    );

    const form = {
      activities: [{ title: 'Test Activity 2', code: 'activity2' }],
      description: 'build something',
      geometry: selectedAoi.geometry,
    };
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining(form)),
    );
  }, 70000);

  it('should use fetched display fetched results if present', () => {
    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
        formState={initialState}
      />,
    );
  });
});
