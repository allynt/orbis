import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SaveSearchForm from './save-search-form.component';

const mockStore = configureMockStore([thunk]);

const buttonName = 'Save Search';
const textfieldPlaceholder = 'Name';

describe.skip('Save Satellite Search Form Component', () => {
  const store = mockStore({});
  let query = null;
  let setVisiblePanel = null;
  let saveSearch = null;
  let close = null;

  beforeEach(cleanup);

  beforeEach(() => {
    query = { aoi: [] };
    setVisiblePanel = jest.fn();
    saveSearch = jest.fn();
    close = jest.fn();
  });

  it('should display a form with a single text field and button', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    expect(getByPlaceholderText(textfieldPlaceholder)).toBeInTheDocument();
    expect(getByText(buttonName)).toBeInTheDocument();
  });

  it('should display an error message when `name` text field is invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    fireEvent.change(getByPlaceholderText(textfieldPlaceholder), {
      target: { value: 'id' },
    });
    expect(
      getByText('Name field must exceed 3 characters'),
    ).toBeInTheDocument();
  });

  it('should disable `Save Search` button when form is invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    expect(getByText(buttonName)).toHaveAttribute('disabled');
    fireEvent.change(getByPlaceholderText(textfieldPlaceholder), {
      target: { value: 'id' },
    });
    expect(getByText(buttonName)).toHaveAttribute('disabled');
  });

  it('should enable `Save Search` button when form is valid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    expect(getByText(buttonName)).toHaveAttribute('disabled');
    fireEvent.change(getByPlaceholderText(textfieldPlaceholder), {
      target: { value: textfieldPlaceholder },
    });
    expect(getByText(buttonName)).not.toHaveAttribute('disabled');
  });

  it('should not call `saveSatelliteSearch` function when form is invalid and `Save Search` button clicked', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    fireEvent.change(getByPlaceholderText(textfieldPlaceholder), {
      target: { value: 'id' },
    });
    fireEvent.click(getByText(buttonName));
    expect(saveSearch).not.toHaveBeenCalled();
  });

  it('should call `saveSatelliteSearch` and `close` function when form is valid and `Save Search` button clicked', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <SaveSearchForm query={query} close={close} saveSearch={saveSearch} />
      </Provider>,
    );

    fireEvent.change(getByPlaceholderText(textfieldPlaceholder), {
      target: { value: textfieldPlaceholder },
    });
    fireEvent.click(getByText(buttonName));

    expect(saveSearch).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
