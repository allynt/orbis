import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalthamCustomDateRange } from './waltham-custom-date-range.component';

const testTimeline = [
    'option-1',
    'option-2',
    'option-3',
    'option-4',
    'option-5',
    'option-6',
    'option-7',
  ],
  onSelect = jest.fn();

const setup = () =>
  render(
    <WalthamCustomDateRange
      timeline={testTimeline}
      value="option-7"
      onSelect={onSelect}
    />,
  );

describe('WalthamCustomDateRange', () => {
  it('renders options in 5-year intervals', () => {
    setup();

    expect(
      screen.getByRole('button', { name: 'option-3 - option-7' }),
    ).toBeInTheDocument();
  });

  it('selects when onChange called', () => {
    setup();

    userEvent.click(
      screen.getByRole('button', { name: 'option-3 - option-7' }),
    );
    userEvent.click(
      screen.getByRole('option', { name: 'option-2 - option-6' }),
    );

    expect(onSelect).toHaveBeenCalledWith('option-6');
  });

  it('filters entries out with no 5-year range', () => {
    setup();

    userEvent.click(
      screen.getByRole('button', { name: 'option-3 - option-7' }),
    );

    [
      'option-1 - option-5',
      'option-2 - option-6',
      'option-3 - option-7',
    ].forEach(option => {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
    });
  });
});
