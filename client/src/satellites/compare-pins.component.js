import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';

import SceneListItem from './scene-list-item.component';

import { ReactComponent as DeleteIcon } from './delete.svg';

import {
  fetchPinnedScenes,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene
} from './satellites.slice';
import { toggleCompareMode } from '../map/map.slice';

import styles from './compare-pins.module.css';

const MAX_SELECTED = 2;

const ComparePins = ({ setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const selectedPinnedScenes = useSelector(state => state.satellites.selectedPinnedScenes);

  const choosePinnedScene = scene => dispatch(selectPinnedScene(scene));

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }

    return () => {
      if (isCompareMode) {
        dispatch(toggleCompareMode());
      }
    };
  }, [pinnedScenes, isCompareMode]);

  const handleChange = (isSelected, scene) => {
    if (isSelected) {
      dispatch(deselectPinnedScene(scene));
    } else {
      if (selectedPinnedScenes.length !== MAX_SELECTED) {
        choosePinnedScene(scene);
      }
    }
  };

  return (
    <div ref={ref}>
      <div className={styles.buttons}>
        <Switch
          name="compare"
          label="Compare"
          checked={isCompareMode}
          disabled={selectedPinnedScenes.length !== MAX_SELECTED}
          onClick={() => dispatch(toggleCompareMode())}
          ariaLabel="Compare"
        />
        <Button
          theme="link"
          classNames={[styles.button]}
          onClick={() => dispatch(clearSelectedPinnedScenes([]))}
          disabled={isCompareMode}
        >
          Clear Pins
        </Button>
      </div>
      <p className={styles.selectMessage}>
        Select <span>2</span> scenes to compare
      </p>
      <ul className={styles.pinnedScenes}>
        {pinnedScenes &&
          pinnedScenes.map((scene, index) => {
            const isSelected = selectedPinnedScenes.includes(scene);
            const isDisabled = !selectedPinnedScenes.includes(scene) && selectedPinnedScenes.length === MAX_SELECTED;
            const Icon = (
              <DeleteIcon
                onClick={() => {
                  !isCompareMode && dispatch(deletePinnedScene(scene.id));
                }}
              />
            );
            return (
              <div key={scene.id} className={styles.compareItem}>
                <Checkbox
                  name={scene.id}
                  label={scene.label}
                  checked={isSelected}
                  disabled={isCompareMode || isDisabled}
                  onChange={() => handleChange(isSelected, scene)}
                />
                <SceneListItem
                  index={index}
                  scene={scene}
                  icon={Icon}
                  setSelectedMoreInfo={setSelectedMoreInfo}
                  toggleMoreInfoDialog={toggleMoreInfoDialog}
                  selectScene={choosePinnedScene}
                />
              </div>
            );
          })}
      </ul>
    </div>
  );
};

ComparePins.propTypes = {};

export default React.memo(React.forwardRef(ComparePins));
