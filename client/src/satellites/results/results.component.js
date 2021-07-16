import React from 'react';

import {
  Box,
  List,
  Paper,
  Slider,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { compareDesc } from 'date-fns';

import { DEFAULT_CLOUD_COVER } from '../satellite.constants';
import SceneListItem, {
  SceneListItemSkeleton,
} from '../scene-list-item/scene-list-item.component';

const useStyles = makeStyles({
  list: {
    maxHeight: '100%',
    overflowY: 'auto',
    margin: '0 -0.5rem -1.5rem',
  },
});

/**
 * @param {{
 *  scenes: import('typings/satellites').Scene[]
 *  hoveredScene?: import('typings/satellites').Scene
 *  selectedScene?: import('typings/satellites').Scene
 *  visualisationId: string
 *  cloudCoverPercentage?: number
 *  onCloudCoverSliderChange?: (value: number) => void
 *  onSceneHover: (scene?: import('typings/satellites').Scene) => void,
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void,
 * }} props
 */
const Results = ({
  scenes: allScenes,
  hoveredScene,
  selectedScene,
  visualisationId,
  cloudCoverPercentage = DEFAULT_CLOUD_COVER,
  onCloudCoverSliderChange,
  onSceneHover,
  onSceneClick,
}) => {
  const styles = useStyles();

  const filteredScenes = [...(allScenes ?? [])]
    .sort((sceneA, sceneB) =>
      compareDesc(new Date(sceneA.created), new Date(sceneB.created)),
    )
    .filter(scene => scene.cloudCover <= cloudCoverPercentage);

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
      <List className={styles.list}>
        {allScenes
          ? filteredScenes.map(scene => (
              <SceneListItem
                key={scene.id}
                scene={scene}
                hovered={hoveredScene?.id === scene.id}
                selected={selectedScene?.id === scene.id}
                visualisationId={visualisationId}
                onHover={onSceneHover}
                onSceneClick={onSceneClick}
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
