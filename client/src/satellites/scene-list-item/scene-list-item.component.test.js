import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SceneListItem from './scene-list-item.component';

const freeScene = {
  id: 1,
  thumbnail_url: 'thumbnail1',
  created: '2000-01-01T00:00:00Z',
  cloudCover: 5,
};

describe('<SceneListItem />', () => {
  it('Calls onSceneClick when the scene is clicked', () => {
    const onSceneClick = jest.fn();
    const { getByRole } = render(
      <SceneListItem scene={freeScene} onSceneClick={onSceneClick} />,
    );
    userEvent.click(getByRole('button', { name: freeScene.id.toString() }));
    expect(onSceneClick).toBeCalledWith(freeScene);
  });

  it('Shows a secondary action if provided', () => {
    const { getByText } = render(
      <SceneListItem scene={freeScene} secondaryAction="Hello" />,
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
