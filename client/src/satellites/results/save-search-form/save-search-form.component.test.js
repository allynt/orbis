import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SaveSearchForm from './save-search-form.component';

const renderComponent = () => {
  const saveSearch = jest.fn();
  const close = jest.fn();
  const utils = render(
    <SaveSearchForm close={close} saveSearch={saveSearch} />,
  );
  return { ...utils, saveSearch, close };
};

describe('Save Satellite Search Form Component', () => {
  it('should display a form with a single text field and button', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should display an error message when `name` text field is invalid', () => {
    const { getByRole, getByText } = renderComponent();

    userEvent.type(getByRole('textbox'), 'id');
    expect(
      getByText('Name field must exceed 3 characters'),
    ).toBeInTheDocument();
  });

  it('should disable `Save Search` button when form is invalid', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button')).toBeDisabled();
    userEvent.type(getByRole('textbox'), 'id');
    expect(getByRole('button')).toBeDisabled();
  });

  it('should enable `Save Search` button when form is valid', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button')).toBeDisabled();
    userEvent.type(getByRole('textbox'), 'test');
    expect(getByRole('button')).not.toBeDisabled();
  });

  it('should not call `saveSatelliteSearch` function when form is invalid and `Save Search` button clicked', () => {
    const { getByRole, saveSearch } = renderComponent();

    userEvent.type(getByRole('textbox'), 'id');
    userEvent.click(getByRole('button'));
    expect(saveSearch).not.toHaveBeenCalled();
  });

  it('should call `saveSatelliteSearch` and `close` function when form is valid and `Save Search` button clicked', () => {
    const { getByRole, saveSearch, close } = renderComponent();

    userEvent.type(getByRole('textbox'), 'test');
    userEvent.click(getByRole('button'));

    expect(saveSearch).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
