import React from 'react';

import { render, screen } from 'test/test-utils';

import AssessmentDialog from './assessment-dialog.component';

describe('AssessmentDialog', () => {
  let close = null;
  let onSubmit = null;

  beforeEach(() => {
    close = jest.fn();
    onSubmit = jest.fn();
  });

  xit('should not show the dialog', () => {
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
      screen.queryByRole('button', { name: /submit assessment/i }),
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

    expect(
      screen.getByRole('button', { name: /submit assessment/i }),
    ).toBeInTheDocument();
  });
});
