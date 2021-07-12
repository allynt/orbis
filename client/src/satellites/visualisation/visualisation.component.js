import React from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@astrosat/astrosat-ui';

/**
 * @param {{
 *  visualisations: import('typings/satellites').Visualisation[]
 *  visualisationId?: string
 *  onVisualisationClick: (visualisationId: import('typings/satellites').Visualisation['id']) => void
 * }} props
 */
const Visualisation = ({
  visualisations,
  visualisationId,
  onVisualisationClick,
}) =>
  visualisations ? (
    <>
      <Typography variant="h1" gutterBottom>
        VISUALISATION
      </Typography>
      <List>
        {visualisations.map(({ id, description, label, thumbnail }) => (
          <ListItem
            key={id}
            button
            selected={id === visualisationId}
            onClick={() => onVisualisationClick('TCI')}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={thumbnail}
                alt="Scene Visualisation Thumbnail"
              />
            </ListItemAvatar>
            <ListItemText primary={label} secondary={description} />
          </ListItem>
        ))}
      </List>
    </>
  ) : null;

export default Visualisation;
