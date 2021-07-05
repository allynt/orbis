import React, { useState } from 'react';

import {
  Button,
  List,
  PinIcon,
  Slider,
  Typography,
  Paper,
  Box,
} from '@astrosat/astrosat-ui';

import { DEFAULT_CLOUD_COVER } from '../satellite.constants';
import SceneListItem, {
  SceneListItemSkeleton,
} from '../scene-list-item/scene-list-item.component';

const Results = ({
  scenes,
  setVisiblePanel,
  selectScene,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
  pinnedScenes,
  pinScene,
  deletePinnedScene,
  saveSatelliteSearch,
  currentSearchQuery,
}) => {
  const [cloudCoverPercentage, setCloudCoverPercentage] = useState(
    DEFAULT_CLOUD_COVER,
  );

  const [isSaveDialogVisible, toggleSaveDialog] = useState(false);

  const resultCountText = scenes
    ? `Showing ${
        scenes.filter(scene => scene.cloudCover <= cloudCoverPercentage[0])
          .length
      } Results of ${scenes.length}`
    : 'Loading Results...';

  return (
    <>
      <Typography variant="h3">CLOUD COVER %:</Typography>
      <Box px={1}>
        <Slider
          min={0}
          max={100}
          value={cloudCoverPercentage}
          onChange={value => setCloudCoverPercentage(value)}
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
                  <PinIcon
                    key={`${scene.id}-icon`}
                    titleAccess={`pin-icon-${scene.id}`}
                    onClick={() => {
                      isPinned ? deletePinnedScene(scene.id) : pinScene(scene);
                    }}
                  />
                );
                return (
                  <SceneListItem
                    key={scene.id}
                    scene={scene}
                    icon={Icon}
                    selectScene={selectScene}
                    setVisiblePanel={setVisiblePanel}
                    toggleMoreInfoDialog={toggleMoreInfoDialog}
                    setSelectedMoreInfo={setSelectedMoreInfo}
                  />
                );
              })
          : Array(5)
              .fill(0)
              .map((num, i) => <SceneListItemSkeleton key={i} />)}
      </List>
      <Button theme="primary" onClick={() => toggleSaveDialog(c => !c)}>
        Save Search
      </Button>
      {/* <Dialog
        isVisible={isSaveDialogVisible}
        title="Name Search"
        close={toggleSaveDialog}
        ref={ref}
      >
        <SaveSearchForm
          query={currentSearchQuery}
          close={toggleSaveDialog}
          saveSearch={saveSatelliteSearch}
        />
      </Dialog> */}
    </>
  );
};

export default Results;
