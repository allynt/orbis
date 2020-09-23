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

  const MAP_STYLE_DATA = [
    {
      id: 'streets',
      uri: 'mapbox://styles/astrosat/cjtrrv8be37ge1fqwl0ef8rb9',
      title: 'Streets',
    },
    {
      id: 'light',
      uri: 'mapbox://styles/astrosat/cjtiotoam3tff1fruptp84ekd',
      title: 'Light',
    },
    {
      id: 'dark',
      uri: 'mapbox://styles/astrosat/cjtrrxg8l1nxt1fpd6x7f0ln8',
      title: 'Dark',
    },
    {
      id: 'satellite',
      uri: 'mapbox://styles/astrosat/cjtsgocbv57ok1fqqsjez3de6',
      title: 'Satellite',
    },
  ];

  beforeEach(() => {
    selectMapStyle = jest.fn();

    selectedMapStyle = MAP_STYLE_DATA[1];

    testee = render(
      <Provider store={store}>
        <MapStyleSwitcher
          mapStyles={MAP_STYLE_DATA}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={selectMapStyle}
        />
      </Provider>,
    );
  });

  afterEach(cleanup);

  test.each(MAP_STYLE_DATA)('should render style %#', style => {
    expect(testee.getByLabelText(style.title)).toBeInTheDocument();
  });

  it('should render with the `Light` Map Style selected', () => {
    expect(testee.getByLabelText('Light').checked).toEqual(true);
  });

  it('should call the selectMapStyle with the `Dark` Map Style is selected', () => {
    expect(testee.getByLabelText('Dark').checked).toEqual(false);

    fireEvent.click(testee.getByLabelText('Dark'));

    expect(selectMapStyle).toHaveBeenCalledWith(MAP_STYLE_DATA[2]);
    expect(selectMapStyle).not.toHaveBeenCalledWith(MAP_STYLE_DATA[1]);
  });
});
