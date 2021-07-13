import React from 'react';

import {
  Box,
  IconButton,
  List,
  Paper,
  PinIcon,
  Slider,
  Typography,
} from '@astrosat/astrosat-ui';

import { DEFAULT_CLOUD_COVER, InfoType } from '../satellite.constants';
import SceneListItem, {
  SceneListItemSkeleton,
} from '../scene-list-item/scene-list-item.component';

/**
 * @param {{
 *  scenes: import('typings/satellites').Scene[]
 *  selectedScene?: import('typings/satellites').Scene
 *  pinnedScenes: import('typings/satellites').Scene[],
 *  visualisationId: string
 *  cloudCoverPercentage?: number
 *  onCloudCoverSliderChange?: (value: number) => void
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void,
 *  onScenePin: (scene: import('typings/satellites').Scene) => void,
 *  onSceneUnpin: (scene: import('typings/satellites').Scene) => void,
 *  onInfoClick: (info: {
 *    type: string;
 *    data: any;
 *  }) => void,
 * }} props
 */
const Results = ({
  scenes: allScenes,
  selectedScene,
  pinnedScenes,
  visualisationId,
  cloudCoverPercentage = DEFAULT_CLOUD_COVER,
  onCloudCoverSliderChange,
  onSceneClick,
  onScenePin,
  onSceneUnpin,
  onInfoClick,
}) => {
  const filteredScenes = allScenes?.filter(
    scene => scene.cloudCover <= cloudCoverPercentage,
  );

  const resultCountText = allScenes
    ? `Showing ${filteredScenes.length} Results of ${allScenes.length}`
    : 'Loading Results...';

  return (
    <>
      <Typography variant="h3">CLOUD COVER %:</Typography>
      <Box px={1}>
        <Slider
          min={0}
          max={100}
          value={cloudCoverPercentage}
          onChange={(_event, value) => onCloudCoverSliderChange(value)}
          disabled={!filteredScenes}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      <Typography variant="h3">RESULTS</Typography>
      <Paper elevation={0} square>
        <Typography>{resultCountText}</Typography>
      </Paper>
      <List>
        {allScenes
          ? filteredScenes
              .filter(scene => scene.cloudCover <= cloudCoverPercentage)
              .map(scene => {
                const isPinned = pinnedScenes?.some(pin => scene.id === pin.id);
                const Icon = (
                  <IconButton
                    key={`${scene.id}-icon`}
                    onClick={() => {
                      isPinned ? onSceneUnpin(scene) : onScenePin(scene);
                    }}
                  >
                    <PinIcon titleAccess={`pin-icon-${scene.id}`} />
                  </IconButton>
                );
                return (
                  <SceneListItem
                    key={scene.id}
                    scene={scene}
                    selected={selectedScene?.id === scene.id}
                    secondaryAction={Icon}
                    visualisationId={visualisationId}
                    onSceneClick={onSceneClick}
                    onInfoClick={scene => {
                      onInfoClick({
                        type: InfoType.SCENE,
                        data: scene,
                      });
                    }}
                  />
                );
              })
          : Array(5)
              .fill(0)
              .map((_num, i) => <SceneListItemSkeleton key={i} />)}
      </List>
    </>
  );
};

export default Results;
