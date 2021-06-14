import React, { useState } from 'react';

import {
  // Slider,
  Button,
  // useModal,
  Dialog,
  PinIcon,
} from '@astrosat/astrosat-ui';

import styles from './results.module.css';
import { DEFAULT_CLOUD_COVER } from './satellite.constants';
import SaveSearchForm from './save-search-form.component';
import SceneListItem, {
  SceneListItemSkeleton,
} from './scene-list-item.component';
import sceneStyles from './scene-list-item.module.css';
// import sideMenuStyles from '../control-panel/control-panel.module.css';

const Results = (
  {
    scenes,
    setVisiblePanel,
    selectScene,
    setSelectedMoreInfo,
    toggleMoreInfoDialog,
    pinnedScenes,
    pinScene,
    deletePinnedScene,
    saveSatelliteSearch,
    currentSearchQuery,
  },
  ref,
) => {
  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([
    DEFAULT_CLOUD_COVER,
  ]);

  // const [isSaveDialogVisible, toggleSaveDialog] = useModal(false);

  const resultCountText = scenes
    ? `Showing ${
        scenes.filter(scene => scene.cloudCover <= cloudCoverPercentage[0])
          .length
      } Results of ${scenes.length}`
    : 'Loading Results...';

  return (
    <div className={styles.options} ref={ref}>
      <div>
        <h3>CLOUD COVER %:</h3>
        {/* <Slider
          min={0}
          max={100}
          values={cloudCoverPercentage}
          onChange={value => setCloudCoverPercentage(value)}
          disabled={!scenes}
        /> */}
      </div>
      <div className={styles.results}>
        <h3>RESULTS</h3>
        <div className={styles.resultCount}>{resultCountText}</div>
        <ul className={sceneStyles.scenes}>
          {scenes
            ? scenes
                .filter(scene => scene.cloudCover <= cloudCoverPercentage[0])
                .map(scene => {
                  const isPinned = pinnedScenes?.some(
                    pin => scene.id === pin.id,
                  );
                  const Icon = (
                    <PinIcon
                      key={`${scene.id}-icon`}
                      title={`pin-icon-${scene.id}`}
                      // classes={`${isPinned && styles.pinned}`}
                      onClick={() => {
                        isPinned
                          ? deletePinnedScene(scene.id)
                          : pinScene(scene);
                      }}
                    />
                  );
                  return (
                    <li key={scene.id}>
                      <SceneListItem
                        scene={scene}
                        icon={Icon}
                        selectScene={selectScene}
                        setVisiblePanel={setVisiblePanel}
                        toggleMoreInfoDialog={toggleMoreInfoDialog}
                        setSelectedMoreInfo={setSelectedMoreInfo}
                      />
                    </li>
                  );
                })
            : Array(5)
                .fill(0)
                .map((num, i) => <SceneListItemSkeleton key={i} />)}
        </ul>
      </div>
      {/* <div className={sideMenuStyles.buttons}>
        <Button
          classNames={[sideMenuStyles.button]}
          theme="primary"
          onClick={() => toggleSaveDialog()}
        >
          Save Search
        </Button>
      </div> */}
      {/* <Dialog
        isVisible={isSaveDialogVisible}
        title="Name Search"
        close={toggleSaveDialog}
        ref={ref}
      >
        <SaveSearchForm
          query={currentSearchQuery}
          close={toggleSaveDialog}
          saveSearch={saveSatelliteSearch}
        />
      </Dialog> */}
    </div>
  );
};

export default React.memo(React.forwardRef(Results));
