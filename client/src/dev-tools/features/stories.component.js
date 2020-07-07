import React, { useState, useEffect } from 'react';

import featureToggles, { enable, disable } from '../persistence';

const Stories = () => {
  const [stories, setStories] = useState(featureToggles.stories);

  useEffect(() => {
    if (stories) {
      enable('stories');
    } else {
      disable('stories');
    }
  }, [stories]);

  return (
    <div>
      <label>
        Enable Stories:{' '}
        <input
          type="checkbox"
          checked={stories}
          onChange={e => setStories(e.target.checked)}
        />
      </label>
    </div>
  );
};

export default Stories;
