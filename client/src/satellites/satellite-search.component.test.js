import React from 'react';

import {
  render,
  cleanup,
  fireEvent,
  within,
  getByTitle,
} from '@testing-library/react';
import { format, subDays } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SatelliteSearch from './satellite-search.component';

const mockStore = configureMockStore([thunk]);

const DATE_FORMAT = 'yyy-MM-dd';

describe.skip('Satellite Search Component', () => {
  let store = null;

  let map = null;
  let satellites = null;
  let setVisiblePanel = null;
  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;

  beforeEach(cleanup);

  beforeEach(() => {
    store = mockStore({
      satellites: {
        satelliteSearches: [],
        currentSearchQuery: null,
      },
      app: {
        config: {
          maximumAoiArea: 5,
        },
      },
    });

    map = mapboxgl.Map();
    map.addControl({
      id: 'drawCtrl',
      changeMode: jest.fn(),
      deleteAll: jest.fn(),
      getAll: jest.fn(() => ({
        features: [
          {
            geometry: {
              coordinates: [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
            },
          },
        ],
      })),
      setFeatureProperty: jest.fn(),
    });
    satellites = [
      {
        id: 1,
        label: 'Test Satellite 1',
      },
      {
        id: 2,
        label: 'Test Satellite 2',
      },
    ];
    setVisiblePanel = jest.fn();
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();
  });

  it('should render the `No Satellite Searches` message', () => {
    const { container, getByText, getByTitle } = render(
      <Provider store={store}>
        <SatelliteSearch
          map={map}
          satellites={satellites}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>,
    );

    expect(getByText('There are no saved AOI yet')).toBeInTheDocument();
    expect(getByTitle('draw-area-icon')).toBeInTheDocument();
    expect(getByText('Draw AOI')).toBeInTheDocument();

    const formSections = container.querySelectorAll('.formSection');

    const satellitesSection = formSections[0];
    expect(
      within(satellitesSection).getByText('Data Source'),
    ).toBeInTheDocument();
    const satelliteListItems = satellitesSection.querySelectorAll('li');
    satelliteListItems.forEach((item, i) => {
      expect(within(item).getByText(satellites[i].label)).toBeInTheDocument();
    });

    const dateRangeSection = formSections[1];
    const startDate = format(subDays(new Date(), 7), DATE_FORMAT);
    const endDate = format(new Date(), DATE_FORMAT);
    expect(within(dateRangeSection).getByText(startDate)).toBeInTheDocument();
    expect(within(dateRangeSection).getByText(endDate)).toBeInTheDocument();

    const tiersSection = formSections[2];
    expect(within(tiersSection).getByText('Free images')).toBeInTheDocument();
    expect(
      within(tiersSection).getByText('Mid-resolution'),
    ).toBeInTheDocument();
    expect(
      within(tiersSection).getByText('High-resolution'),
    ).toBeInTheDocument();

    expect(getByText('Search')).toBeInTheDocument();
    expect(getByText('Task Satellite')).toBeInTheDocument();
  });

  it('should put the map into draw mod when `Draw AOI` button clicked', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SatelliteSearch
          map={map}
          satellites={satellites}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>,
    );

    expect(map._controls[0].changeMode).not.toHaveBeenCalled();
    fireEvent.click(getByText('Draw AOI'));
    expect(map._controls[0].changeMode).toHaveBeenCalled();
  });
});
