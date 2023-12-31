import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Results from './results.component';

const mockScenes = [
  {
    id: '32UVD',
    cloudCover: 0.5,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-01T00:00:00Z',
  },
  {
    id: '323UVD',
    cloudCover: 0.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-02T01:00:00Z',
  },
  {
    id: '33UVD',
    cloudCover: 10.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-03T01:00:00Z',
  },
];

const renderComponent = ({ scenes = mockScenes, ...rest } = {}) => {
  const onSceneClick = jest.fn();
  const onInfoClick = jest.fn();
  const onSaveSearchSubmit = jest.fn();
  const onCloudCoverSliderChange = jest.fn();
  const testee = render(
    <Results
      scenes={scenes}
      {...rest}
      onCloudCoverSliderChange={onCloudCoverSliderChange}
      onSceneClick={onSceneClick}
      onInfoClick={onInfoClick}
      onSaveSearchSubmit={onSaveSearchSubmit}
    />,
  );

  return {
    ...testee,
    onSceneClick,
    onInfoClick,
    onSaveSearchSubmit,
    onCloudCoverSliderChange,
  };
};

describe('Satellite Results Component', () => {
  it("Shows loading text and skeleton scenes where there's no scenes", () => {
    const { getByText, getAllByRole } = renderComponent({
      scenes: null,
      isFetchingResults: true,
    });
    expect(getByText('Loading Results...')).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(5);
  });

  it("Shows no results if there's no scenes and not loading", () => {
    const { getByText, queryByRole } = renderComponent({
      scenes: null,
      isFetchingResults: false,
    });
    expect(getByText('No Results')).toBeInTheDocument();
    expect(queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('Shows results filtered by cloud cover', () => {
    const { getByRole, getByText } = renderComponent({
      cloudCoverPercentage: 10,
    });
    expect(getByRole('button', { name: mockScenes[0].id })).toBeInTheDocument();
    expect(getByRole('button', { name: mockScenes[1].id })).toBeInTheDocument();
    expect(getByText('Showing 2 Results')).toBeInTheDocument();
  });

  it('should render a list of Scene results', () => {
    const { getByRole, getByText } = renderComponent();
    mockScenes.forEach(scene =>
      expect(getByRole('button', { name: scene.id })).toBeInTheDocument(),
    );
    expect(getByText('Showing 3 Results')).toBeInTheDocument();
  });

  it('Calls onCloudCoverSliderChange when the slider is moved', () => {
    const { getByRole, onCloudCoverSliderChange } = renderComponent();
    fireEvent.mouseDown(getByRole('slider'));
    expect(onCloudCoverSliderChange).toBeCalled();
  });

  it('Calls onSceneClick when a scene is clicked', () => {
    const { getByRole, onSceneClick } = renderComponent();
    userEvent.click(getByRole('button', { name: mockScenes[0].id }));
    expect(onSceneClick).toBeCalledWith(mockScenes[0]);
  });
});
