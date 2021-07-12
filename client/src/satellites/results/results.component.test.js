import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
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
    created: '2000-01-02T01:00:00Z',
  },
];

const renderComponent = ({
  scenes = mockScenes,
  pinnedScenes,
  cloudCoverPercentage,
} = {}) => {
  const onSceneClick = jest.fn();
  const onScenePin = jest.fn();
  const onSceneUnpin = jest.fn();
  const onInfoClick = jest.fn();
  const onSaveSearchSubmit = jest.fn();
  const onCloudCoverSliderChange = jest.fn();
  const testee = render(
    <Results
      scenes={scenes}
      pinnedScenes={pinnedScenes}
      cloudCoverPercentage={cloudCoverPercentage}
      onCloudCoverSliderChange={onCloudCoverSliderChange}
      onSceneClick={onSceneClick}
      onScenePin={onScenePin}
      onSceneUnpin={onSceneUnpin}
      onInfoClick={onInfoClick}
      onSaveSearchSubmit={onSaveSearchSubmit}
    />,
  );

  return {
    ...testee,
    onSceneClick,
    onInfoClick,
    onScenePin,
    onSceneUnpin,
    onSaveSearchSubmit,
    onCloudCoverSliderChange,
  };
};

describe('Satellite Results Component', () => {
  it("Shows loading text and skeleton scenes where there's no scenes", () => {
    const { getByText, getAllByRole } = renderComponent({ scenes: null });
    expect(getByText('Loading Results...')).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(5);
  });

  it('should render a list of Scene results', () => {
    const { getAllByRole, getByText } = renderComponent({});
    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(getByText('Showing 2 Results of 3')).toBeInTheDocument();
  });

  it('Shows results filtered by cloud cover', () => {
    const { getAllByRole, getByText } = renderComponent({
      cloudCoverPercentage: 100,
    });
    expect(getAllByRole('listitem')).toHaveLength(mockScenes.length);
    expect(getByText('Showing 3 Results of 3')).toBeInTheDocument();
  });

  it('Calls onCloudCoverSliderChange when the slider is moved', () => {
    const { getByRole, onCloudCoverSliderChange } = renderComponent();
    fireEvent.mouseDown(getByRole('slider'));
    expect(onCloudCoverSliderChange).toBeCalled();
  });

  it('Calls onSceneClick when a scene is clicked', () => {
    const { getAllByRole, onSceneClick } = renderComponent();
    userEvent.click(getAllByRole('button')[0]);
    expect(onSceneClick).toBeCalledWith(mockScenes[0]);
  });

  it('Calls onInfoClick when an info button is clicked', () => {
    const { getAllByRole, onInfoClick } = renderComponent();
    userEvent.click(getAllByRole('button', { name: 'More Info' })[0]);
    expect(onInfoClick).toBeCalled();
  });

  it('Calls onScenePin when pin icon clicked', () => {
    const { onScenePin, getByTitle } = renderComponent({
      pinnedScenes: [],
    });

    userEvent.click(getByTitle(`pin-icon-${mockScenes[0].id}`));
    expect(onScenePin).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should call onSceneUnpin when already pinned pin icon clicked', () => {
    const { onSceneUnpin, getByTitle } = renderComponent({
      pinnedScenes: [{ ...mockScenes[0] }],
    });

    userEvent.click(getByTitle(`pin-icon-${mockScenes[0].id}`));
    expect(onSceneUnpin).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should show dialog component when Save Search button clicked', () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Search' }));
    expect(getByText('Name Search')).toBeVisible();
  });

  it('Closes the dialog when the background is clicked', () => {
    const { getByText, getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Search' }));
    expect(getByText('Name Search')).toBeVisible();
    userEvent.click(getByRole('none'));
    expect(getByText('Name Search')).not.toBeVisible();
  });

  it('Calls onSaveSearchSubmit when the save search form is submitted', async () => {
    const { getByRole, onSaveSearchSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Search' }));
    userEvent.type(getByRole('textbox'), 'Test Name');
    userEvent.click(getByRole('button', { name: 'Save Search' }));
    await waitFor(() => expect(onSaveSearchSubmit).toBeCalledWith('Test Name'));
  });
});
