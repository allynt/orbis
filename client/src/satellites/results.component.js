import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';

import { fetchPinnedScenes, pinScene, saveSatelliteSearch } from './satellites.actions';

import SaveSearchForm from './save-search-form.component';
import SceneListItem, { SceneListItemSkeleton } from './scene-list-item.component';

import { ReactComponent as PinIcon } from './pin.svg';

import styles from './results.module.css';
import sceneStyles from './scene-list-item.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene, setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);
  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }
  }, [pinnedScenes]);
  console.log(pinnedScenes);

  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);

  const [isSaveDialogVisible, toggleSaveDialog] = useModal(false);

  const resultCountText = scenes
    ? `Showing ${scenes.filter(scene => scene.cloudCover <= cloudCoverPercentage[0]).length} Results`
    : 'Loading Results...';

  const saveSearch = query => dispatch(saveSatelliteSearch(query));
  const chooseSearch = scene => dispatch(selectScene(scene));

  return (
    <div className={styles.options} ref={ref}>
      <div>
        <h3>CLOUD COVER %:</h3>
        <Slider
          min={0}
          max={100}
          values={cloudCoverPercentage}
          onChange={value => setCloudCoverPercentage(value)}
          disabled={!scenes}
        />
      </div>
      <div className={styles.results}>
        <h3>RESULTS</h3>
        <div className={styles.resultCount}>{resultCountText}</div>
        <ul className={sceneStyles.scenes}>
          {scenes
            ? scenes
                .filter(scene => scene.cloudCover <= cloudCoverPercentage[0])
                .map(scene => {
                  const isPinned = pinnedScenes?.some(pin => scene.id === pin.id);
                  const Icon = (
                    <PinIcon
                      className={`${styles.pinIcon} ${isPinned && styles.pinned}`}
                      onClick={() => {
                        dispatch(pinScene(scene));
                      }}
                    />
                  );
                  return (
                    <li key={scene.id}>
                      <SceneListItem
                        scene={scene}
                        icon={Icon}
                        selectScene={chooseSearch}
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
      <div className={sideMenuStyles.buttons}>
        <Button classNames={[sideMenuStyles.button]} theme="primary" onClick={() => toggleSaveDialog()}>
          Save Search
        </Button>
      </div>
      <Dialog isVisible={isSaveDialogVisible} title="Name Search" close={toggleSaveDialog} ref={ref}>
        <SaveSearchForm query={currentSearchQuery} close={toggleSaveDialog} saveSearch={saveSearch} />
      </Dialog>
    </div>
  );
};

export default React.memo(React.forwardRef(Results));
