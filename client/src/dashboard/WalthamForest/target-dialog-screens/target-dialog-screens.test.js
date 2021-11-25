import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inputErrorMessage } from '../waltham.constants';
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

      expect(getByRole('button', { name: 'Next' })).toBeDisabled();

      userEvent.click(getByText(defaultValue));

      expect(getByText(datasetName)).toBeInTheDocument();
      userEvent.click(getByText(datasetName));

      expect(getByRole('button', { name: 'Next' })).not.toBeDisabled();
    });

    it('fires callback when changes have been made and `Next` button is clicked', () => {
      const onNextClick = jest.fn(),
        expected = 'totalHousing';

      const { getByText, getByRole } = render(
        <SelectScreen onNextClick={onNextClick} />,
      );

      userEvent.click(getByText(defaultValue));
      userEvent.click(getByText(datasetName));
      userEvent.click(getByRole('button', { name: 'Next' }));
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

      expect(getByRole('button', { name: 'Add Target' })).toBeDisabled();
      userEvent.type(getByPlaceholderText('2011 - 2012'), '123');
      expect(getByRole('button', { name: 'Add Target' })).not.toBeDisabled();
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

    it('clears all values when `Reset` button is clicked', () => {
      const { getByRole, getByPlaceholderText } = render(<TargetScreen />);

      const input1 = getByPlaceholderText('2011 - 2012'),
        input2 = getByPlaceholderText('2012 - 2013');

      userEvent.type(input1, '123');
      userEvent.type(input2, '456');

      userEvent.click(getByRole('button', { name: 'Reset' }));

      expect(input1).toHaveValue('');
      expect(input2).toHaveValue('');
    });
  });

  describe('validation', () => {
    it('allows numbers', () => {
      const { queryByText, getByPlaceholderText } = render(<TargetScreen />);

      userEvent.type(getByPlaceholderText('2011 - 2012'), '123');
      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('allows decimals', () => {
      const { queryByText, getByPlaceholderText } = render(<TargetScreen />);

      userEvent.type(getByPlaceholderText('2011 - 2012'), '123.456');
      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('does not allow letters', () => {
      const { getByText, getByPlaceholderText } = render(<TargetScreen />);

      userEvent.type(getByPlaceholderText('2011 - 2012'), 'abc');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('does not allow special characters', () => {
      const { getByText, getByPlaceholderText } = render(<TargetScreen />);

      userEvent.type(getByPlaceholderText('2011 - 2012'), ';,%');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('removes error message when restricted characters removed', () => {
      const { getByText, queryByText, getByPlaceholderText } = render(
        <TargetScreen />,
      );

      const input = getByPlaceholderText('2011 - 2012');

      userEvent.type(input, ';,%');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();

      userEvent.clear(input);
      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('disables `Add Targets` button if a single field fails validation', () => {
      const { getByText, getByRole, getByPlaceholderText } = render(
        <TargetScreen />,
      );

      const input1 = getByPlaceholderText('2011 - 2012'),
        input2 = getByPlaceholderText('2012 - 2013');

      userEvent.type(input1, '123');
      userEvent.type(input2, 'abc');
      userEvent.clear(input1);

      expect(getByText(inputErrorMessage)).toBeInTheDocument();
      expect(getByRole('button', { name: 'Add Target' })).toBeDisabled();
    });
  });
});
