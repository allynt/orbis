import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent } from '@testing-library/react';

import MapStyleSwitcher from './map-style-switcher.component';

const mockStore = configureMockStore([thunk]);

describe('MapStyle Switcher Component', () => {
  const store = mockStore({});

  let testee = null;
  let selectMapStyle = null;
  let selectedMapStyle = null;

  const MAP_STYLE_DATA = {
    streets: {},
    light: {},
    dark: {},
    satellite: {},
  };

  beforeEach(() => {
    selectMapStyle = jest.fn();

    selectedMapStyle = Object.keys(MAP_STYLE_DATA)[1];

    testee = render(
      <Provider store={store}>
        <MapStyleSwitcher
          defaultOpen
          mapStyles={MAP_STYLE_DATA}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={selectMapStyle}
        />
      </Provider>,
    );
  });

  afterEach(cleanup);

  it.each(Object.keys(MAP_STYLE_DATA))('should render style %s', style => {
    expect(testee.getByLabelText(style, { exact: false })).toBeInTheDocument();
  });

  it('should render with the `Light` Map Style selected', () => {
    expect(testee.getByLabelText('Light').checked).toEqual(true);
  });

  it('should call the selectMapStyle with the `Dark` Map Style is selected', () => {
    expect(testee.getByLabelText('Dark').checked).toEqual(false);

    fireEvent.click(testee.getByLabelText('Dark'));

    expect(selectMapStyle).toHaveBeenCalledWith(Object.keys(MAP_STYLE_DATA)[2]);
    expect(selectMapStyle).not.toHaveBeenCalledWith(
      Object.keys(MAP_STYLE_DATA)[1],
    );
  });
});
