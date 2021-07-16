import React from 'react';

import { Box, List, Paper, Slider, Typography } from '@astrosat/astrosat-ui';

import { DEFAULT_CLOUD_COVER, InfoType } from '../satellite.constants';
import SceneListItem, {
  SceneListItemSkeleton,
} from '../scene-list-item/scene-list-item.component';

/**
 * @param {{
 *  scenes: import('typings/satellites').Scene[]
 *  selectedScene?: import('typings/satellites').Scene
 *  visualisationId: string
 *  cloudCoverPercentage?: number
 *  onCloudCoverSliderChange?: (value: number) => void
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void,
 *  onInfoClick: (info: {
 *    type: string;
 *    data: any;
 *  }) => void,
 * }} props
 */
const Results = ({
  scenes: allScenes,
  selectedScene,
  visualisationId,
  cloudCoverPercentage = DEFAULT_CLOUD_COVER,
  onCloudCoverSliderChange,
  onSceneClick,
  onInfoClick,
}) => {
  const filteredScenes = allScenes?.filter(
    scene => scene.cloudCover <= cloudCoverPercentage,
  );

  const resultCountText = allScenes
    ? `Showing ${filteredScenes.length} Results`
    : 'Loading Results...';

  return (
    <>
      <Typography
        variant="h3"
        component="h2"
        id="cloud-cover-title"
        gutterBottom
      >
        Cloud Cover %
      </Typography>
      <Box px={1}>
        <Slider
          aria-labelledby="cloud-cover-title"
          min={0}
          max={100}
          value={cloudCoverPercentage}
          onChange={(_event, value) => onCloudCoverSliderChange(value)}
          disabled={!filteredScenes}
          marks={new Array(6)
            .fill()
            .map((_value, i) => ({ value: i * 20, label: `${i * 20}` }))}
          valueLabelDisplay="auto"
        />
      </Box>
      <Typography variant="h3" gutterBottom>
        Results
      </Typography>
      <Paper
        style={{ margin: '0 -0.5rem', padding: '0.5rem' }}
        elevation={0}
        square
      >
        <Typography>{resultCountText}</Typography>
      </Paper>
      <List>
        {allScenes
          ? filteredScenes.map(scene => (
              <SceneListItem
                key={scene.id}
                scene={scene}
                selected={selectedScene?.id === scene.id}
                visualisationId={visualisationId}
                onSceneClick={onSceneClick}
                onInfoClick={scene => {
                  onInfoClick({
                    type: InfoType.SCENE,
                    data: scene,
                  });
                }}
              />
            ))
          : Array(5)
              .fill(0)
              // eslint-disable-next-line react/no-array-index-key
              .map((_num, i) => <SceneListItemSkeleton key={i} />)}
      </List>
    </>
  );
};

export default Results;
