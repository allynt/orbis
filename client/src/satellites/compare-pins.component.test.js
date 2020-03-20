import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, within } from '@testing-library/react';

import { parseISO, format } from 'date-fns';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import ComparePins from './compare-pins.component';

const mockStore = configureMockStore([thunk]);

describe('Compare Pins Component', () => {
  const pinnedScenes = [
    {
      id: 1,
      label: 'Pinned Scene 1',
      created: '2000-01-01T00:00:00Z'
    },
    {
      id: 2,
      label: 'Pinned Scene 2',
      created: '2000-01-02T00:00:00Z'
    },
    {
      id: 3,
      label: 'Pinned Scene 3',
      created: '2000-01-03T00:00:00Z'
    }
  ];

  let store = null;

  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;

  beforeEach(cleanup);

  beforeEach(() => {
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();

    fetch.resetMocks();
  });

  it('should render an empty list of pinned scenes', () => {
    store = mockStore({
      satellites: {
        pinnedScenes: [],
        selectedPinnedScenes: []
      },
      map: {
        isCompareMode: false
      }
    });

    const { container, getByText } = render(
      <Provider store={store}>
        <ComparePins setSelectedMoreInfo={setSelectedMoreInfo} toggleMoreInfoDialog={toggleMoreInfoDialog} />
      </Provider>
    );

    expect(getByText('Compare')).toBeInTheDocument();
    expect(getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    store = mockStore({
      satellites: {
        pinnedScenes,
        selectedPinnedScenes: []
      },
      map: {
        isCompareMode: false
      }
    });

    const { container } = render(
      <Provider store={store}>
        <ComparePins setSelectedMoreInfo={setSelectedMoreInfo} toggleMoreInfoDialog={toggleMoreInfoDialog} />
      </Provider>
    );
    const pinnedSceneElements = container.querySelectorAll('.compareItem');
    pinnedSceneElements.forEach((scene, i) => {
      expect(within(scene).getByText(pinnedScenes[i].label)).toBeInTheDocument();
      expect(within(scene).getByText('delete.svg')).toBeInTheDocument();
      expect(within(scene).getByText(format(parseISO(pinnedScenes[i].created), DATE_FORMAT))).toBeInTheDocument();
      expect(
        within(scene).getByText(`${format(parseISO(pinnedScenes[i].created), TIME_FORMAT)} UTC`)
      ).toBeInTheDocument();
      expect(within(scene).getByText('delete.svg')).toBeInTheDocument();
      expect(within(scene).getByText('More info')).toBeInTheDocument();
    });
  });

  it('should fetch a list of pinned scenes, on first render', () => {
    fetch.mockResponse(JSON.stringify(pinnedScenes));

    store = mockStore({
      satellites: {
        pinnedScenes: null,
        selectedPinnedScenes: []
      },
      map: {
        isCompareMode: false
      },
      accounts: {
        userKey: 123
      }
    });

    render(
      <Provider store={store}>
        <ComparePins setSelectedMoreInfo={setSelectedMoreInfo} toggleMoreInfoDialog={toggleMoreInfoDialog} />
      </Provider>
    );
    expect(fetch.mock.calls.length).toBe(1);
  });
});
