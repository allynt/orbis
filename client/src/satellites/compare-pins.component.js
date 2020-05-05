import React, { useEffect } from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';

import SceneListItem from './scene-list-item.component';

import { ReactComponent as DeleteIcon } from './delete.svg';

import styles from './compare-pins.module.css';

const MAX_SELECTED = 2;

const ComparePins = (
  {
    setSelectedMoreInfo,
    toggleMoreInfoDialog,
    selectPinnedScene,
    deselectPinnedScene,
    clearSelectedPinnedScenes,
    deletePinnedScene,
    toggleCompareMode,
    pinnedScenes,
    selectedPinnedScenes,
    isCompareMode,
  },
  ref,
) => {
  useEffect(() => {
    return () => {
      if (isCompareMode) {
        toggleCompareMode();
      }
    };
  }, []);

  const handleChange = (isSelected, scene) => {
    if (isSelected) {
      deselectPinnedScene(scene);
    } else {
      if (selectedPinnedScenes.length !== MAX_SELECTED) {
        selectPinnedScene(scene);
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
          onClick={() => toggleCompareMode()}
          ariaLabel="Compare Toggle"
        />
        <Button
          theme="link"
          classNames={[styles.button]}
          onClick={() => clearSelectedPinnedScenes([])}
          disabled={selectedPinnedScenes.length < 1}
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
            const isSelected = selectedPinnedScenes.some(selectedScene => selectedScene.id === scene.id);
            const isDisabled = !selectedPinnedScenes.includes(scene) && selectedPinnedScenes.length === MAX_SELECTED;
            const Icon = (
              <DeleteIcon
                className={isSelected ? styles.disabled : ''}
                onClick={() => !isSelected && deletePinnedScene(scene.id)}
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
                  selectScene={scene => handleChange(isSelected, scene)}
                />
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default React.memo(React.forwardRef(ComparePins));
