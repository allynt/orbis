import React from 'react';

import { Box, List, Typography } from '@astrosat/astrosat-ui';

import AoiListItem from './aoi-list-item.component';

const AoiList = ({ aois, selectAoi, editAoiDetails, deleteAoi }) => {
  return (
    <>
      <Typography variant="h3" component="p" gutterBottom>
        Select existing Area of Interest
      </Typography>

      {aois?.length > 0 ? (
        <List>
          {aois.map(aoi => (
            <AoiListItem
              key={aoi.name}
              aoi={aoi}
              selectAoi={selectAoi}
              editAoiDetails={editAoiDetails}
              deleteAoi={deleteAoi}
            />
          ))}
        </List>
      ) : (
        <Box component={List} display="flex" justifyContent="center">
          <Typography variant="h3" component="li">
            No Saved AOIs
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AoiList;
