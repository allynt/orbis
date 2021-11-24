import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SelectScreen, TargetScreen } from './target-dialog-screens';

describe('Target Dialog Screens', () => {
  describe('SelectScreen', () => {
    const defaultValue = 'Select Type of Target',
      datasetName =
        'Total Housing Test Target For Each of The Last 5 Financial Years';
    it('renders', () => {
      const { getByRole } = render(<SelectScreen />);
      expect(getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('disables `Next` button until changes have been made', () => {
      const { getByRole, getByText } = render(<SelectScreen />);

      const button = getByRole('button', { name: 'Next' });
      expect(button).toBeDisabled();

      userEvent.click(getByText(defaultValue));

      expect(getByText(datasetName)).toBeInTheDocument();
      userEvent.click(getByText(datasetName));

      expect(button).not.toBeDisabled();
    });

    it('fires callback when changes have been made and `Next` button is clicked', () => {
      const onNextClick = jest.fn(),
        expected = 'totalHousing';

      const { getByText } = render(<SelectScreen onNextClick={onNextClick} />);

      userEvent.click(getByText(defaultValue));
      userEvent.click(getByText(datasetName));
      expect(onNextClick).toHaveBeenCalledWith(expected);
    });
  });

  describe('TargetScreen', () => {
    it('renders', () => {
      const { getByRole } = render(<TargetScreen />);
      expect(getByRole('button', { name: 'Add Target' })).toBeInTheDocument();
    });

    it('disables `Add Target` button until changes have been made', () => {
      const { getByRole, getByPlaceholderText } = render(<TargetScreen />);

      const button = getByRole('button', { name: 'Add Target' });

      expect(button).toBeDisabled();
      userEvent.type(getByPlaceholderText('2011 - 2012'), '123');
      expect(button).not.toBeDisabled();
    });

    it('fires callback when changes have been made and `Add Target` button is clicked', () => {
      const onAddTargetsClick = jest.fn(),
        expected = {
          '2011 - 2012': '123',
          '2012 - 2013': '456',
        };

      const { getByRole, getByPlaceholderText } = render(
        <TargetScreen onAddTargetsClick={onAddTargetsClick} />,
      );

      userEvent.type(getByPlaceholderText('2011 - 2012'), '123');
      userEvent.type(getByPlaceholderText('2012 - 2013'), '456');

      userEvent.click(getByRole('button', { name: 'Add Target' }));
      expect(onAddTargetsClick).toHaveBeenCalledWith(expected);
    });
  });
});
