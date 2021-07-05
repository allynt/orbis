import React, { useEffect } from 'react';

import {
  Switch,
  Checkbox,
  List,
  Link,
  DeleteIcon,
  FormControlLabel,
} from '@astrosat/astrosat-ui';

import SceneListItem from '../scene-list-item/scene-list-item.component';

const MAX_SELECTED = 2;

const ComparePins = ({
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
}) => {
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
    <>
      <FormControlLabel
        name="compare"
        label="Compare"
        disabled={selectedPinnedScenes?.length !== MAX_SELECTED}
        onClick={() => toggleCompareMode()}
        control={<Switch checked={isCompareMode} />}
      />

      <Link
        component="button"
        onClick={() => !isCompareMode && clearSelectedPinnedScenes([])}
        disabled={selectedPinnedScenes?.length < 1 || isCompareMode}
      >
        Clear Pins
      </Link>
      <List>
        {pinnedScenes &&
          pinnedScenes.map((scene, index) => {
            const isSelected = selectedPinnedScenes?.some(
              selectedScene => selectedScene.id === scene.id,
            );
            const isDisabled =
              !selectedPinnedScenes?.includes(scene) &&
              selectedPinnedScenes?.length === MAX_SELECTED;
            const Icon = (
              <DeleteIcon
                color="primary"
                titleAccess={`delete-icon-${scene.id}`}
                onClick={() => !isSelected && deletePinnedScene(scene.id)}
              />
            );
            return (
              <React.Fragment key={scene.id}>
                <Checkbox
                  name={scene.id}
                  inputProps={{ 'aria-label': scene.id }}
                  checked={isSelected}
                  disabled={isCompareMode || isDisabled}
                  onChange={() => handleChange(isSelected, scene)}
                />
                <SceneListItem
                  scene={scene}
                  icon={Icon}
                  setSelectedMoreInfo={setSelectedMoreInfo}
                  toggleMoreInfoDialog={toggleMoreInfoDialog}
                  selectScene={scene =>
                    !isCompareMode && handleChange(isSelected, scene)
                  }
                />
              </React.Fragment>
            );
          })}
      </List>
    </>
  );
};

export default ComparePins;
