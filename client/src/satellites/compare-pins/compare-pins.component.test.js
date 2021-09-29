import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import ComparePins from './compare-pins.component';

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

describe('Compare Pins Component', () => {
  let state = null;
  let props = null;

  beforeEach(() => {
    state = {
      satellites: {
        visualisationId: 'TCI',
      },
    };

    props = {
      selectPinnedScene: jest.fn(),
      deselectPinnedScene: jest.fn(),
      clearSelectedPinnedScenes: jest.fn(),
      deletePinnedScene: jest.fn(),
      toggleCompareMode: jest.fn(),
      pinnedScenes: mockScenes,
      selectedPinnedScenes: [],
      isCompareMode: false,
    };
  });

  it('should render an empty list of pinned scenes', () => {
    const { container } = render(<ComparePins {...props} pinnedScenes={[]} />, {
      state,
    });

    expect(screen.getByText('Compare')).toBeInTheDocument();
    expect(screen.getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    render(<ComparePins {...props} />, {
      state,
    });
    const pinnedSceneElements = screen.getAllByRole('listitem');
    expect(pinnedSceneElements).toHaveLength(mockScenes.length);
  });

  it('should render Compare Mode button disabled when not enough pinned scenes selected', () => {
    render(
      <ComparePins {...props} selectedPinnedScenes={[{ ...mockScenes[1] }]} />,
      { state },
    );

    expect(screen.getByRole('checkbox', { name: 'Compare' })).toBeDisabled();
  });

  it('should not be able to toggle Compare Mode when not enough pinned scenes selected', () => {
    render(
      <ComparePins {...props} selectedPinnedScenes={[{ ...mockScenes[1] }]} />,
      { state },
    );

    userEvent.click(screen.getByRole('checkbox', { name: 'Compare' }));
    expect(props.toggleCompareMode).not.toHaveBeenCalled();
  });

  it('should toggle into Compare Mode when there are enough pinned scenes selected', () => {
    render(
      <ComparePins
        {...props}
        selectedPinnedScenes={[mockScenes[0], mockScenes[1]]}
      />,
      { state },
    );

    expect(
      screen.getByRole('checkbox', { name: 'Compare' }),
    ).not.toHaveAttribute('disabled');
    userEvent.click(screen.getByRole('checkbox', { name: 'Compare' }));
    expect(props.toggleCompareMode).toHaveBeenCalled();
  });

  it('should render Clear Pins button disabled', () => {
    render(<ComparePins {...props} />, {
      state,
    });

    expect(screen.getByRole('button', { name: 'Clear Pins' })).toBeDisabled();
  });

  it('should render Clear Pins button enabled', () => {
    render(
      <ComparePins {...props} selectedPinnedScenes={[{ ...mockScenes[2] }]} />,
      { state },
    );

    expect(
      screen.getByRole('button', { name: 'Clear Pins' }),
    ).not.toBeDisabled();
  });

  it('should Clear selected pinned scenes', () => {
    render(
      <ComparePins {...props} selectedPinnedScenes={[{ ...mockScenes[2] }]} />,
      { state },
    );

    userEvent.click(screen.getByRole('button', { name: 'Clear Pins' }));
    expect(props.clearSelectedPinnedScenes).toHaveBeenCalled();
  });

  it("should delete pinned scene, when scene's icon clicked", () => {
    render(<ComparePins {...props} />, {
      state,
    });

    userEvent.click(
      screen.getByRole('button', { name: `delete-icon-${mockScenes[0].id}` }),
    );
    expect(props.deletePinnedScene).toHaveBeenCalledWith(mockScenes[0].id);
  });

  it('should deselect pinned scene, when scene clicked and already selected', () => {
    render(
      <ComparePins {...props} selectedPinnedScenes={[{ ...mockScenes[0] }]} />,
      { state },
    );

    userEvent.click(screen.getByRole('checkbox', { name: mockScenes[0].id }));

    expect(props.deselectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should select pinned scene, when scene clicked and not already selected', () => {
    render(<ComparePins {...props} />, {
      state,
    });

    userEvent.click(screen.getByRole('checkbox', { name: mockScenes[0].id }));

    expect(props.selectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });
});
