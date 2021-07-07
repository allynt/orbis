import React, { useState } from 'react';

import {
  Button,
  List,
  PinIcon,
  Slider,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@astrosat/astrosat-ui';

import { SCENE, VISUALISATION } from 'satellites/satellites.component';

import { DEFAULT_CLOUD_COVER } from '../satellite.constants';
import SceneListItem, {
  SceneListItemSkeleton,
} from '../scene-list-item/scene-list-item.component';
import SaveSearchForm from './save-search-form/save-search-form.component';

/**
 * @param {{
 *  scenes: import('typings/satellites').Scene[]
 *  pinnedScenes: import('typings/satellites').Scene[],
 *  visualisationId: string
 *  defaultCloudCover?: number
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void,
 *  onScenePin: (scene: import('typings/satellites').Scene) => void,
 *  onSceneUnpin: (scene: import('typings/satellites').Scene) => void,
 *  onInfoClick: (info: {
 *    type: string;
 *    data: any;
 *  }) => void,
 *  onSaveSearchSubmit: (name: string) => void
 * }} props
 */
const Results = ({
  scenes,
  pinnedScenes,
  visualisationId,
  defaultCloudCover = DEFAULT_CLOUD_COVER,
  onSceneClick,
  onScenePin,
  onSceneUnpin,
  onInfoClick,
  onSaveSearchSubmit,
}) => {
  const [cloudCoverPercentage, setCloudCoverPercentage] = useState(
    defaultCloudCover,
  );

  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  const resultCountText = scenes
    ? `Showing ${
        scenes.filter(scene => scene.cloudCover <= cloudCoverPercentage).length
      } Results of ${scenes.length}`
    : 'Loading Results...';

  /**
   * @param {string} name
   */
  const handleSaveSearchSubmit = name => {
    setIsSaveDialogVisible(false);
    onSaveSearchSubmit(name);
  };

  return (
    <>
      <Typography variant="h3">CLOUD COVER %:</Typography>
      <Box px={1}>
        <Slider
          min={0}
          max={100}
          value={cloudCoverPercentage}
          onChange={(_event, value) => setCloudCoverPercentage(value)}
          disabled={!scenes}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
      <Typography variant="h3">RESULTS</Typography>
      <Paper elevation={0} square>
        <Typography>{resultCountText}</Typography>
      </Paper>
      <List>
        {scenes
          ? scenes
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
                    secondaryAction={Icon}
                    visualisationId={visualisationId}
                    onSceneClick={onSceneClick}
                    onInfoClick={scene => {
                      onInfoClick({
                        type: SCENE,
                        data: scene,
                      });
                    }}
                  />
                );
              })
          : Array(5)
              .fill(0)
              .map((num, i) => <SceneListItemSkeleton key={i} />)}
      </List>
      <Button onClick={() => setIsSaveDialogVisible(true)}>Save Search</Button>
      <Dialog
        open={isSaveDialogVisible}
        onClose={() => setIsSaveDialogVisible(false)}
      >
        <DialogTitle>Name Search</DialogTitle>
        <DialogContent>
          <SaveSearchForm onSubmit={handleSaveSearchSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Results;
