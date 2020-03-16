import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import SceneListItem from './scene-list-item.component';

import {
  fetchPinnedScenes,
  selectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene
} from './satellites.actions';
import { toggleCompareMaps } from '../map/map.actions';

import styles from './compare-pins.module.css';

const MAX_SELECTED = 2;

const ComparePins = () => {
  const dispatch = useDispatch();

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const selectedPinnedScenes = useSelector(state => state.satellites.selectedPinnedScenes);

  const ref = useRef(null);
  const [isSceneMoreInfoDialogVisible, toggleSceneMoreInfoDialog] = useModal(false);
  const [selectedSceneMoreInfo, setSelectedSceneMoreInfo] = useState(null);

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }
  }, [pinnedScenes]);

  return (
    <div ref={ref}>
      <div className={styles.buttons}>
        <Switch
          name="compare"
          label="Compare"
          clicked={isCompareMode}
          onClick={() => dispatch(toggleCompareMaps())}
          ariaLabel="Compare"
        />
        <Button theme="link" classNames={[styles.button]} onClick={() => dispatch(clearSelectedPinnedScenes([]))}>
          Clear Pins
        </Button>
      </div>
      <p className={styles.selectMessage}>
        Select <span>2</span> scenes to compare
      </p>
      <ul className={styles.pinnedScenes}>
        {pinnedScenes &&
          pinnedScenes.map((scene, index) => {
            return (
              <div key={scene.id} className={styles.compareItem}>
                <Checkbox
                  name={scene.id}
                  label={scene.label}
                  checked={selectedPinnedScenes.find(selectedScene => selectedScene.id === scene.id)}
                  onChange={() => {
                    if (selectedPinnedScenes.length !== MAX_SELECTED) {
                      dispatch(selectPinnedScene(scene));
                    }
                  }}
                />
                <SceneListItem
                  index={index}
                  scene={scene}
                  icon="delete"
                  setSelectedSceneMoreInfo={setSelectedSceneMoreInfo}
                  toggleSceneMoreInfoDialog={toggleSceneMoreInfoDialog}
                  selectPinnedScene={selectPinnedScene}
                  deletePinnedScene={deletePinnedScene}
                />
              </div>
            );
          })}
      </ul>

      <Dialog
        isVisible={isSceneMoreInfoDialogVisible}
        title="Resolution Info"
        close={toggleSceneMoreInfoDialog}
        ref={ref}
      >
        <div>
          <h3>Resolution More Info</h3>
          <table className={styles.moreInfoContent}>
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th scope="col">Value</th>
              </tr>
            </thead>

            <thead>
              {selectedSceneMoreInfo &&
                Object.keys(selectedSceneMoreInfo).map(key => {
                  return (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>{selectedSceneMoreInfo[key]}</td>
                    </tr>
                  );
                })}
            </thead>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

ComparePins.propTypes = {};

export default ComparePins;
