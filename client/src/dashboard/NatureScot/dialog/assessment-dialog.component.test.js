import React from 'react';

import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, screen, waitFor } from 'test/test-utils';

import { userEvent } from '../../../test/test-utils';
import AssessmentDialog from './assessment-dialog.component';

const mockStore = createMockStore([thunk]);

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

    const button = screen.getByRole('button', { name: /show activities/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    expect(
      screen.queryByRole('button', { name: /run impact assessment/i }),
    ).not.toBeInTheDocument();
  });

  it('should enable the `show activities` button', async () => {
    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
      />,
    );

    const button = screen.getByRole('button', { name: /show activities/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

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

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /show activities/i }),
      ).toBeEnabled(),
    );
  });

  it('should show the activities panel when the `show activities` button enabled and clicked', async () => {
    render(
      <AssessmentDialog
        open={true}
        close={close}
        onSubmit={onSubmit}
        visibleTab={0}
      />,
    );

    const button = screen.getByRole('button', { name: /show activities/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

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

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /show activities/i }),
      ).toBeEnabled(),
    );

    userEvent.click(screen.getByRole('button', { name: /show activities/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /hide activities/i }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('group', { name: /select activities/i }),
    ).toBeInTheDocument();
  });

  xit('should enable the `run impact assessment` button', async () => {
    render(
      <Provider
        store={mockStore({
          natureScotDashboard: {
            activities: [
              { id: 1, label: 'Test Activity 1', proposed: true },
              { id: 2, label: 'Test Activity 2', proposed: false },
            ],
          },
        })}
      >
        <AssessmentDialog
          open={true}
          close={close}
          onSubmit={onSubmit}
          visibleTab={0}
        />
      </Provider>,
    );

    const button = screen.getByRole('button', { name: /show activities/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

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

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /show activities/i }),
      ).toBeEnabled(),
    );

    userEvent.click(screen.getByRole('button', { name: /show activities/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /hide activities/i }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('group', { name: /select activities/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /run impact assessment/i }),
    ).toBeDisabled();

    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Test Activity 2' })),
    );
    userEvent.click(screen.getByTestId('choose activity'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /run impact assessment/i }),
      ).toBeEnabled(),
    );
  }, 70000);

  xit('should submit the form when the `run impact assessment` button is enabled and clicked', async () => {
    render(
      <Provider
        store={mockStore({
          natureScotDashboard: {
            activities: [
              { id: 1, label: 'Test Activity 1', proposed: true },
              { id: 2, label: 'Test Activity 2', proposed: false },
            ],
          },
        })}
      >
        <AssessmentDialog
          open={true}
          close={close}
          onSubmit={onSubmit}
          visibleTab={0}
        />
      </Provider>,
    );

    const button = screen.getByRole('button', { name: /show activities/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

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

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /show activities/i }),
      ).toBeEnabled(),
    );

    userEvent.click(screen.getByRole('button', { name: /show activities/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /hide activities/i }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('group', { name: /select activities/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /run impact assessment/i }),
    ).toBeDisabled();

    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: 'Test Activity 2' })),
    );
    userEvent.click(screen.getByTestId('choose activity'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /run impact assessment/i }),
      ).toBeEnabled(),
    );

    userEvent.click(
      screen.getByRole('button', { name: /run impact assessment/i }),
    );

    const form = {
      activities: [{ id: 2, label: 'Test Activity 2', proposed: false }],
      description: 'build something',
      geometry: undefined,
    };
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining(form)),
    );
  }, 70000);
});
