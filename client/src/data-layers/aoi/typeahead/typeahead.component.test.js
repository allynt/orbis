import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import Typeahead from './typeahead.component';

const PLACEHOLDER_TEXT = 'Search by name area, postcode, grid reference';

describe('Typeahead Component', () => {
  let search = null;
  let onSelectedSuggestionClick = null;

  beforeEach(() => {
    onSelectedSuggestionClick = jest.fn();

    search = jest.fn(() =>
      Promise.resolve({
        type: 'postcode-area',
        suggestions: [
          {
            type: 'protected-area',
            title: 'Test Protected Area',
            localAuthority: {
              name: 'Test Local Authority',
            },
            suggestions: [],
            bbox: [0, 0, 1, 1],
          },
          {
            type: 'place',
            title: 'Test Place',
            localAuthority: 'Test Local Authority',
            suggestions: [],
            center: [0, 0],
          },
        ],
      }),
    );
  });

  it('should display a textfield, with placeholder text', () => {
    render(<Typeahead />);

    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument();
  });

  it('should run search function when text typed', async () => {
    render(
      <Typeahead
        search={search}
        onSelectedSuggestionClick={onSelectedSuggestionClick}
      />,
    );

    userEvent.type(screen.getByPlaceholderText(PLACEHOLDER_TEXT), 'EH7');

    await waitFor(() => {
      expect(search).toHaveBeenCalledTimes(1);
    });
  });

  it('should display a list of suggestions if any exist for typed in text', async () => {
    render(
      <Typeahead
        search={search}
        onSelectedSuggestionClick={onSelectedSuggestionClick}
      />,
    );

    userEvent.type(screen.getByPlaceholderText(PLACEHOLDER_TEXT), 'EH7');

    await waitFor(() => {
      expect(search).toHaveBeenCalledTimes(1);

      expect(
        screen.getByText('Test Protected Area - Test Local Authority'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Test Place - Test Local Authority'),
      ).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByText('Test Protected Area - Test Local Authority'),
    );

    expect(onSelectedSuggestionClick).toHaveBeenCalledTimes(1);
  });
});
