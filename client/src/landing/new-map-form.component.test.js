import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { regions } from '../map/map.constants';

import NewMapForm from './new-map-form.component';

const domains = ['Troposphere', 'Action for help and something'];
const mockStore = configureMockStore([thunk]);

describe('New Map Form Component', () => {
  let history = null;
  let store = null;
  let bookmarkTitles = null;

  beforeEach(cleanup);

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });

    store = mockStore({
      map: {
        regions,
        domains,
      },
    });

    bookmarkTitles = ['Title 1', 'Title 2', 'Title 3'];
  });

  it('should display form with a disabled submit button', () => {
    const { getByPlaceholderText, getByText } = render(
      <Router history={history}>
        <Provider store={store}>
          <NewMapForm
            regions={regions}
            domains={domains}
            bookmarkTitles={bookmarkTitles}
          />
        </Provider>
      </Router>,
    );

    expect(getByPlaceholderText('Add Title*')).toBeInTheDocument();
    expect(getByPlaceholderText('Add Description')).toBeInTheDocument();

    // FIXME: Ensure select boxes are present.
    // const selectElements = container.querySelectorAll('input');
    // // const regionInput = selectElements[0];
    // console.log('ELEMET: ', selectElements);
    // // const domainInput = selectElements[1];
    // // expect(regionInput).toHaveAttribute('name', 'region');

    const submitButton = getByText('Create');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should enable the form submit button when the form is valid', () => {
    const { getByPlaceholderText, getByText } = render(
      <Router history={history}>
        <Provider store={store}>
          <NewMapForm
            regions={regions}
            domains={domains}
            bookmarkTitles={bookmarkTitles}
          />
        </Provider>
      </Router>,
    );

    const submitButton = getByText('Create');
    expect(submitButton).toHaveAttribute('disabled');
    fireEvent.change(getByPlaceholderText('Add Title*'), {
      target: { value: 'New Map Title' },
    });
    fireEvent.change(getByPlaceholderText('Add Description'), {
      target: { value: 'New Map Description' },
    });
    waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'));
  });

  it('should submit the form when form is valid and submit button clicked', () => {
    const { getByPlaceholderText, getByText } = render(
      <Router history={history}>
        <Provider store={store}>
          <NewMapForm
            regions={regions}
            domains={domains}
            bookmarkTitles={bookmarkTitles}
          />
        </Provider>
      </Router>,
    );

    fireEvent.change(getByPlaceholderText('Add Title*'), {
      target: { value: 'New Map Title' },
    });
    fireEvent.change(getByPlaceholderText('Add Description'), {
      target: { value: 'New Map Description' },
    });
    fireEvent.click(getByText('Create'));
    waitFor(() => expect(history.location.pathname).toBe('/map'));
  });
});
