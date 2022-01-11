import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import ComparePins from './compare-pins.component';

const MOCK_SCENES = [
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

describe('Compare Pins Component', () => {
  it('should render an empty list of pinned scenes', () => {
    const { container } = render(<ComparePins pinnedScenes={[]} />);

    expect(screen.getByText('Compare')).toBeInTheDocument();
    expect(screen.getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    render(<ComparePins pinnedScenes={MOCK_SCENES} />);

    const pinnedSceneElements = screen.getAllByRole('listitem');
    expect(pinnedSceneElements).toHaveLength(MOCK_SCENES.length);
  });

  it('should render Compare Mode button disabled when not enough pinned scenes selected', () => {
    render(<ComparePins selectedPinnedScenes={[{ ...MOCK_SCENES[1] }]} />);

    expect(screen.getByRole('checkbox', { name: 'Compare' })).toBeDisabled();
  });

  it('should not be able to toggle Compare Mode when not enough pinned scenes selected', () => {
    const toggleCompareMode = jest.fn();
    render(
      <ComparePins
        selectedPinnedScenes={[{ ...MOCK_SCENES[1] }]}
        toggleCompareMode={toggleCompareMode}
      />,
    );

    userEvent.click(
      screen.getByRole('checkbox', { name: 'Compare' }),
      undefined,
      {
        skipPointerEventsCheck: true,
      },
    );
    expect(toggleCompareMode).not.toHaveBeenCalled();
  });

  it('should toggle into Compare Mode when there are enough pinned scenes selected', () => {
    const toggleCompareMode = jest.fn();
    render(
      <ComparePins
        selectedPinnedScenes={[MOCK_SCENES[0], MOCK_SCENES[1]]}
        toggleCompareMode={toggleCompareMode}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Compare' })).toBeEnabled();
    userEvent.click(screen.getByRole('checkbox', { name: 'Compare' }));
    expect(toggleCompareMode).toHaveBeenCalled();
  });

  it('should render Clear Pins button disabled', () => {
    render(<ComparePins selectedPinnedScenes={[]} />);

    expect(screen.getByRole('button', { name: 'Clear Pins' })).toBeDisabled();
  });

  it('should render Clear Pins button enabled', () => {
    render(<ComparePins selectedPinnedScenes={[{ ...MOCK_SCENES[2] }]} />);

    expect(screen.getByRole('button', { name: 'Clear Pins' })).toBeEnabled();
  });

  it('should Clear selected pinned scenes', () => {
    const clearSelectedPinnedScenes = jest.fn();
    render(
      <ComparePins
        selectedPinnedScenes={[{ ...MOCK_SCENES[2] }]}
        clearSelectedPinnedScenes={clearSelectedPinnedScenes}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Clear Pins' }));
    expect(clearSelectedPinnedScenes).toHaveBeenCalled();
  });

  it("should delete pinned scene, when scene's icon clicked", () => {
    const deletePinnedScene = jest.fn();
    render(
      <ComparePins
        pinnedScenes={MOCK_SCENES}
        deletePinnedScene={deletePinnedScene}
      />,
    );

    userEvent.click(
      screen.getByRole('button', { name: `delete-icon-${MOCK_SCENES[0].id}` }),
    );
    expect(deletePinnedScene).toHaveBeenCalledWith(MOCK_SCENES[0].id);
  });

  it('should deselect pinned scene, when scene clicked and already selected', () => {
    const deselectPinnedScene = jest.fn();
    render(
      <ComparePins
        pinnedScenes={MOCK_SCENES}
        selectedPinnedScenes={[{ ...MOCK_SCENES[0] }]}
        deselectPinnedScene={deselectPinnedScene}
      />,
    );

    userEvent.click(screen.getByRole('checkbox', { name: MOCK_SCENES[0].id }));

    expect(deselectPinnedScene).toHaveBeenCalledWith(MOCK_SCENES[0]);
  });

  it('should select pinned scene, when scene clicked and not already selected', () => {
    const selectPinnedScene = jest.fn();
    render(
      <ComparePins
        pinnedScenes={MOCK_SCENES}
        selectPinnedScene={selectPinnedScene}
        selectedPinnedScenes={[]}
      />,
    );

    userEvent.click(screen.getByRole('checkbox', { name: MOCK_SCENES[0].id }));

    expect(selectPinnedScene).toHaveBeenCalledWith(MOCK_SCENES[0]);
  });
});
