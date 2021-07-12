import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ComparePins from './compare-pins.component';

const mockStore = configureMockStore([thunk]);

const mockScenes = [
  {
    id: '32UVD',
    label: 'Pinned Scene 1',
    created: '2000-01-01T00:00:00Z',
    thumbnail_url: '/test/url/{VISUALISATION_ID}/tile.png',
  },
  {
    id: '323UVD',
    label: 'Pinned Scene 2',
    created: '2000-01-02T00:00:00Z',
    thumbnail_url: '/test/url/{VISUALISATION_ID}/tile.png',
  },
  {
    id: '33UVD',
    label: 'Pinned Scene 3',
    created: '2000-01-03T00:00:00Z',
    thumbnail_url: '/test/url/{VISUALISATION_ID}/tile.png',
  },
];

const renderComponent = (store, args) => {
  const attributes = {
    selectPinnedScene: jest.fn(),
    deselectPinnedScene: jest.fn(),
    clearSelectedPinnedScenes: jest.fn(),
    deletePinnedScene: jest.fn(),
    toggleCompareMode: jest.fn(),
    pinnedScenes: mockScenes,
    selectedPinnedScenes: [],
    isCompareMode: false,
    ...args,
  };

  const testee = render(
    <Provider store={store}>
      <ComparePins
        selectPinnedScene={attributes.selectPinnedScene}
        deselectPinnedScene={attributes.deselectPinnedScene}
        clearSelectedPinnedScenes={attributes.clearSelectedPinnedScenes}
        deletePinnedScene={attributes.deletePinnedScene}
        toggleCompareMode={attributes.toggleCompareMode}
        pinnedScenes={attributes.pinnedScenes}
        selectedPinnedScenes={attributes.selectedPinnedScenes}
        isCompareMode={attributes.isCompareMode}
      />
    </Provider>,
  );

  return { ...attributes, ...testee };
};

describe('Compare Pins Component', () => {
  let store = null;

  beforeEach(() => {
    store = mockStore({
      satellites: {
        visualisationId: 'TCI',
      },
    });
  });

  it('should render an empty list of pinned scenes', () => {
    const { container, getByText } = renderComponent(store, {
      pinnedScenes: [],
    });

    expect(getByText('Compare')).toBeInTheDocument();
    expect(getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    const { getAllByRole } = renderComponent(store, {});
    const pinnedSceneElements = getAllByRole('listitem');
    expect(pinnedSceneElements).toHaveLength(mockScenes.length);
  });

  it('should render Compare Mode button disabled when not enough pinned scenes selected', () => {
    const { getByRole } = renderComponent(store, {
      selectedPinnedScenes: [{ ...mockScenes[1] }],
    });
    expect(getByRole('checkbox', { name: 'Compare' })).toBeDisabled();
  });

  it('should not be able to toggle Compare Mode when not enough pinned scenes selected', () => {
    const { toggleCompareMode, getByRole } = renderComponent(store, {
      selectedPinnedScenes: [{ ...mockScenes[1] }],
    });

    userEvent.click(getByRole('checkbox', { name: 'Compare' }));
    expect(toggleCompareMode).not.toHaveBeenCalled();
  });

  it('should toggle into Compare Mode when there are enough pinned scenes selected', () => {
    const { toggleCompareMode, getByRole } = renderComponent(store, {
      selectedPinnedScenes: [mockScenes[0], mockScenes[1]],
    });
    expect(getByRole('checkbox', { name: 'Compare' })).not.toHaveAttribute(
      'disabled',
    );
    userEvent.click(getByRole('checkbox', { name: 'Compare' }));
    expect(toggleCompareMode).toHaveBeenCalled();
  });

  it('should render Clear Pins button disabled', () => {
    const { getByRole } = renderComponent(store);

    expect(getByRole('button', { name: 'Clear Pins' })).toBeDisabled();
  });

  it('should render Clear Pins button enabled', () => {
    const { getByRole } = renderComponent(store, {
      selectedPinnedScenes: [{ ...mockScenes[2] }],
    });

    expect(getByRole('button', { name: 'Clear Pins' })).not.toBeDisabled();
  });

  it('should Clear selected pinned scenes', () => {
    const { clearSelectedPinnedScenes, getByRole } = renderComponent(store, {
      selectedPinnedScenes: [{ ...mockScenes[2] }],
    });

    userEvent.click(getByRole('button', { name: 'Clear Pins' }));
    expect(clearSelectedPinnedScenes).toHaveBeenCalled();
  });

  it("should delete pinned scene, when scene's icon clicked", () => {
    const { deletePinnedScene, getByRole } = renderComponent(store);

    userEvent.click(
      getByRole('button', { name: `delete-icon-${mockScenes[0].id}` }),
    );
    expect(deletePinnedScene).toHaveBeenCalledWith(mockScenes[0].id);
  });

  it('should deselect pinned scene, when scene clicked and already selected', () => {
    const { deselectPinnedScene, getByRole } = renderComponent(store, {
      selectedPinnedScenes: [{ ...mockScenes[0] }],
    });

    userEvent.click(getByRole('checkbox', { name: mockScenes[0].id }));

    expect(deselectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should select pinned scene, when scene clicked and not already selected', () => {
    const { selectPinnedScene, getByRole } = renderComponent(store);

    userEvent.click(getByRole('checkbox', { name: mockScenes[0].id }));

    expect(selectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });
});
