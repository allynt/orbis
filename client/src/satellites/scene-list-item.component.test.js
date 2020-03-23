import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent } from '@testing-library/react';

import SceneListItem from './scene-list-item.component';
import { VISUALISATION } from './satellites-panel.component';

const mockStore = configureMockStore([thunk]);

describe('Satellite Scene List Item Component', () => {
  const store = mockStore({});

  let index = null;
  let scene = null;
  let icon = null;
  let selectScene = null;
  let setVisiblePanel = null;
  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;
  let scenes = null;

  beforeEach(cleanup);

  beforeEach(() => {
    scenes = [
      {
        id: 1,
        thumbnail_url: 'thumbnail1',
        created: '2000-01-01T00:00:00Z',
        cloudCover: 5,
        tier: 'free'
      },
      {
        id: 2,
        thumbnail_url: 'thumbnail2',
        created: '2010-01-01T00:00:00Z',
        cloudCover: 15,
        tier: 'mid'
      }
    ];
    index = 0;
    icon = 'icon';
    scene = scenes[index];
    selectScene = jest.fn();
    setVisiblePanel = jest.fn();
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();
  });

  it('should render a single Free Product scene list item', () => {
    const { container, getByText } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    expect(getByText('icon')).toBeInTheDocument();
    expect(getByText('01-01-2000')).toBeInTheDocument();
    expect(getByText('24:00:00 UTC')).toBeInTheDocument();
    expect(getByText('5 %')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', 'thumbnail1');
    expect(getByText('More info')).toBeInTheDocument();
    expect(getByText('Free Product')).toBeInTheDocument();
  });

  it('should render a single scene list item', () => {
    scene = scenes[1];
    const { container, getByText, queryByText } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    expect(getByText('icon')).toBeInTheDocument();
    expect(getByText('01-01-2010')).toBeInTheDocument();
    expect(getByText('24:00:00 UTC')).toBeInTheDocument();
    expect(getByText('15 %')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', 'thumbnail2');
    expect(getByText('More info')).toBeInTheDocument();
    expect(queryByText('Free Product')).toBeNull();
  });

  it('should select scene when scene selected', () => {
    const { container } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    fireEvent.click(container.querySelector('.sceneSection'));
    expect(selectScene).toHaveBeenCalledWith(scenes[0]);
  });

  it('should trigger a panel change when setVisiblePanel called', () => {
    const { container } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    fireEvent.click(container.querySelector('.sceneSection'));
    expect(setVisiblePanel).toHaveBeenCalledWith(VISUALISATION);
  });

  it('should set the scene when `more info` clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    fireEvent.click(container.querySelector('.moreInfo'));
    expect(setSelectedMoreInfo).toHaveBeenCalledWith({ type: 'Scene', data: scenes[0] });
  });

  it('should display a dialog when `more info` clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <SceneListItem
          index={index}
          scene={scene}
          icon={icon}
          selectScene={selectScene}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );

    fireEvent.click(container.querySelector('.moreInfo'));
    expect(toggleMoreInfoDialog).toHaveBeenCalled();
  });
});
