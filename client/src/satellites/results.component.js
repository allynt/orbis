import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';

import { pinScene } from './satellites.actions';

import SaveSearchForm from './save-search-form.component';
import SceneListItem from './scene-list-item.component';

import { ReactComponent as PinIcon } from './pin.svg';

import styles from './results.module.css';
import sceneStyles from './scene-list-item.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene, setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);

  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);

  const [isSaveDialogVisible, toggleSaveDialog] = useModal(false);

  return (
    scenes && (
      <div className={styles.options} ref={ref}>
        <div>
          <h3>CLOUD COVER %:</h3>

          <Slider min={0} max={100} values={cloudCoverPercentage} onChange={value => setCloudCoverPercentage(value)} />
        </div>
        <div className={styles.results}>
          <h3>RESULTS</h3>

          <div className={styles.resultCount}>
            Showing {scenes.filter(scene => scene.cloudCover <= cloudCoverPercentage[0]).length} Results
          </div>

          <ul className={sceneStyles.scenes}>
            {scenes
              .filter(scene => scene.cloudCover <= cloudCoverPercentage[0])
              .map(scene => {
                const Icon = (
                  <PinIcon
                    onClick={() => {
                      dispatch(pinScene(scene));
                    }}
                  />
                );
                return (
                  <SceneListItem
                    key={scene.id}
                    scene={scene}
                    icon={Icon}
                    pinScene={pinScene}
                    selectScene={selectScene}
                    setVisiblePanel={setVisiblePanel}
                    toggleMoreInfoDialog={toggleMoreInfoDialog}
                    setSelectedMoreInfo={setSelectedMoreInfo}
                  />
                );
              })}
          </ul>
        </div>
        <div className={sideMenuStyles.buttons}>
          <Button classNames={[sideMenuStyles.button]} theme="primary" onClick={() => toggleSaveDialog()}>
            Save Search
          </Button>
        </div>

        <Dialog isVisible={isSaveDialogVisible} title="Name Search" close={toggleSaveDialog} ref={ref}>
          <SaveSearchForm query={currentSearchQuery} />
        </Dialog>
      </div>
    )
  );
};

Results.propTypes = {};

export default React.memo(React.forwardRef(Results));
