import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';

import SceneListItem from './scene-list-item.component';

import { ReactComponent as DeleteIcon } from './delete.svg';

import {
  fetchPinnedScenes,
  selectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene
} from './satellites.actions';
import { toggleCompareMaps } from '../map/map.actions';

import styles from './compare-pins.module.css';

const MAX_SELECTED = 2;

const ComparePins = forwardRef(({ setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const selectedPinnedScenes = useSelector(state => state.satellites.selectedPinnedScenes);
  console.log('SELECTED PINNED SCENES: ', selectedPinnedScenes);

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
            const Icon = (
              <DeleteIcon
                onClick={() => {
                  dispatch(deletePinnedScene(scene.id));
                }}
              />
            );
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
                  icon={Icon}
                  setSelectedMoreInfo={setSelectedMoreInfo}
                  toggleMoreInfoDialog={toggleMoreInfoDialog}
                  selectPinnedScene={selectPinnedScene}
                />
              </div>
            );
          })}
      </ul>
    </div>
  );
});

ComparePins.propTypes = {};

export default ComparePins;
