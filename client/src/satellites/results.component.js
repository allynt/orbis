import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { pinScene } from './satellites.actions';

import SaveSearchForm from './save-search-form.component';
import SceneListItem from './scene-list-item.component';

import { ReactComponent as PinIcon } from './pin.svg';

import styles from './results.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene }) => {
  const dispatch = useDispatch();
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);

  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);
  const [selectedSceneMoreInfo, setSelectedSceneMoreInfo] = useState(null);

  const [isSaveDialogVisible, toggleSaveDialog] = useModal(false);
  const [isMoreInfoDialogVisible, toggleSceneMoreInfoDialog] = useModal(false);
  const ref = useRef(null);

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

          <ul className={styles.scenes}>
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
                    selectScene={selectScene}
                    setVisiblePanel={setVisiblePanel}
                    toggleSceneMoreInfoDialog={toggleSceneMoreInfoDialog}
                    setSelectedSceneMoreInfo={setSelectedSceneMoreInfo}
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

        <Dialog isVisible={isMoreInfoDialogVisible} title="More Info" close={toggleSceneMoreInfoDialog} ref={ref}>
          <div>
            <h3>More Info</h3>
            <table className={styles.moreInfoContent}>
              <thead>
                <tr>
                  <th scope="col">Label</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>

              <tbody>
                {selectedSceneMoreInfo &&
                  Object.keys(selectedSceneMoreInfo).map(key => {
                    return (
                      <tr key={key}>
                        <td>{key}:</td>
                        <td>{selectedSceneMoreInfo[key]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Dialog>
      </div>
    )
  );
};

Results.propTypes = {};

export default Results;
