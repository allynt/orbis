import React from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import styles from './stories-panel.module.css';

const StoryList = ({ stories, selectStory, deleteStory }) => {
  console.log('STORIES: ', stories);
  return (
    <div>
      {stories && stories.length > 0 ? (
        <ul className={styles.storyList}>
          {stories.map(story => {
            return (
              <li key={story.title} className={styles.story}>
                {/* {story.}
                <div className={styles.storyThumbnail}>
                  <picture>
                    <source srcSet={story.thumbnail} />
                    <img src={story.thumbnail} alt={story.title} />
                  </picture>
                </div> */}
                <div className={styles.storyContent}>
                  <h3 className={styles.storyTitle}>{story.title}</h3>
                  <p className={styles.storyDescription}>{story.description}</p>
                  <div className={styles.storyButtons}>
                    <Button classNames={[styles.storyButton]} onClick={() => selectStory(story)}>
                      Load
                    </Button>
                    <Button theme="tertiary" classNames={[styles.storyButton]} onClick={() => deleteStory(story)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.noStorys}>No Storys</p>
      )}
    </div>
  );
};

export default StoryList;
