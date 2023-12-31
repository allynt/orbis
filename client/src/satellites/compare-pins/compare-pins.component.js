import React, { useEffect } from 'react';

import {
  Checkbox,
  DeleteIcon,
  FormControlLabel,
  IconButton,
  Link,
  List,
  Switch,
} from '@astrosat/astrosat-ui';

import { InfoType } from 'satellites/satellite.constants';

import SceneListItem from '../scene-list-item/scene-list-item.component';

const MAX_SELECTED = 2;

/**
 * @param {{
 *  onInfoClick: (info: {
 *    type: string;
 *    data: any;
 *  }) => void,
 *  selectPinnedScene: (scene: import('typings').Scene) => void,
 *  deselectPinnedScene: (scene: import('typings').Scene) => void,
 *  clearSelectedPinnedScenes: (stuff: any[]) => void,
 *  deletePinnedScene: (sceneId: import('typings').Scene['id']) => void,
 *  toggleCompareMode: () => void,
 *  pinnedScenes: import('typings').Scene[],
 *  selectedPinnedScenes: import('typings').Scene[],
 *  isCompareMode: boolean,
 *  visualisationId: string
 * }} props
 */
const ComparePins = ({
  onInfoClick,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene,
  toggleCompareMode,
  pinnedScenes,
  selectedPinnedScenes,
  isCompareMode,
  visualisationId,
}) => {
  useEffect(() => {
    return () => {
      if (isCompareMode) {
        toggleCompareMode();
      }
    };
  }, [isCompareMode, toggleCompareMode]);

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
          pinnedScenes.map(scene => {
            const isSelected = selectedPinnedScenes?.some(
              selectedScene => selectedScene.id === scene.id,
            );
            const isDisabled =
              !selectedPinnedScenes?.includes(scene) &&
              selectedPinnedScenes?.length === MAX_SELECTED;
            const Icon = (
              <IconButton
                onClick={() => !isSelected && deletePinnedScene(scene.id)}
              >
                <DeleteIcon
                  color="primary"
                  titleAccess={`delete-icon-${scene.id}`}
                />
              </IconButton>
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
                  secondaryAction={Icon}
                  visualisationId={visualisationId}
                  onSceneClick={scene =>
                    !isCompareMode && handleChange(isSelected, scene)
                  }
                  onInfoClick={scene => {
                    onInfoClick({
                      type: InfoType.SCENE,
                      data: scene,
                    });
                  }}
                />
              </React.Fragment>
            );
          })}
      </List>
    </>
  );
};

export default ComparePins;
