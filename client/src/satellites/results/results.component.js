import React, { useMemo } from 'react';

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

const useStyles = makeStyles(theme => ({
  resultCount: { margin: theme.spacing(0, -1), padding: theme.spacing(1) },
  list: {
    maxHeight: '100%',
    overflowY: 'auto',
    margin: theme.spacing(0, -1, -3),
  },
}));

/**
 * @param {TemplateStringsArray} strings
 * @param {number} resultsLength
 * @returns {(isFetchingResults: boolean, hasScenes: boolean) => string}
 */
const resultsText =
  (strings, resultsLength) => (isFetchingResults, hasScenes) => {
    if (isFetchingResults) return 'Loading Results...';
    if (!isFetchingResults && !hasScenes) return `No Results`;
    return strings.join(`${resultsLength}`);
  };

/**
 * @param {{
 *  scenes: import('typings').Scene[]
 *  hoveredScene?: import('typings').Scene
 *  selectedScene?: import('typings').Scene
 *  visualisationId: string
 *  cloudCoverPercentage?: number
 *  isFetchingResults?: boolean
 *  onCloudCoverSliderChange?: (value: number) => void
 *  onSceneHover: (scene?: import('typings').Scene) => void,
 *  onSceneClick: (scene: import('typings').Scene) => void,
 * }} props
 */
const Results = ({
  scenes: allScenes,
  hoveredScene,
  selectedScene,
  visualisationId,
  cloudCoverPercentage = DEFAULT_CLOUD_COVER,
  isFetchingResults = false,
  onCloudCoverSliderChange,
  onSceneHover,
  onSceneClick,
}) => {
  const styles = useStyles();

  const filteredScenes = useMemo(
    () =>
      [...(allScenes ?? [])]
        .sort((sceneA, sceneB) =>
          compareDesc(new Date(sceneA.created), new Date(sceneB.created)),
        )
        .filter(scene => scene.cloudCover <= cloudCoverPercentage),
    [allScenes, cloudCoverPercentage],
  );

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
          marks={new Array(6).fill().map((_value, i) => {
            const value = i * 20;
            return { value, label: value.toString() };
          })}
          valueLabelDisplay="auto"
        />
      </Box>
      <Typography variant="h3" gutterBottom>
        Results
      </Typography>
      <Paper className={styles.resultCount} elevation={0} square>
        <Typography>
          {resultsText`Showing ${filteredScenes.length} Results`(
            isFetchingResults,
            !!allScenes,
          )}
        </Typography>
      </Paper>
      {allScenes || isFetchingResults ? (
        <List className={styles.list}>
          {!isFetchingResults
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
      ) : null}
    </>
  );
};

export default Results;
