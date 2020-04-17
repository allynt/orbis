import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoriesList from './stories-list.component';

import { fetchStories, selectStory } from './stories.slice';

import styles from '../side-menu/side-menu.module.css';

const StoriesPanel = ({ map }) => {
  const dispatch = useDispatch();

  // const owner = useSelector(state => state.accounts.user.id);
  const stories = useSelector(state => state.stories.stories);

  const chooseStory = story => dispatch(selectStory(story));

  useEffect(() => {
    if (!stories) {
      dispatch(fetchStories());
    }
  }, [stories, dispatch]);

  return (
    <div className={styles.container}>
      <StoriesList stories={stories} selectStory={chooseStory} />
    </div>
  );
};

export default StoriesPanel;
