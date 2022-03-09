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

  it('should not show the dialog', () => {
    render(<AssessmentDialog open={false} close={close} onSubmit={onSubmit} />);

    expect(
      screen.queryByRole('heading', { name: /impact assessment components/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /submit assessment/i }),
    ).not.toBeInTheDocument();
  });

  it('should show the dialog', () => {
    render(<AssessmentDialog open={true} close={close} onSubmit={onSubmit} />);

    expect(
      screen.getByRole('heading', { name: /impact assessment components/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit assessment/i }),
    ).toBeInTheDocument();
  });
});
