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
 *  setCurrentVisualisation: (visualisationId: import('typings/satellites').Visualisation['id']) => void
 * }} props
 */
const Visualisation = ({ visualisations, setCurrentVisualisation }) =>
  visualisations ? (
    <>
      <Typography variant="h1" gutterBottom>
        VISUALISATION
      </Typography>
      <List>
        {visualisations.map(visualisation => (
          <ListItem
            key={visualisation.id}
            button
            onClick={() => setCurrentVisualisation('TCI')}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={visualisation.thumbnail}
                alt="Scene Visualisation Thumbnail"
              />
            </ListItemAvatar>
            <ListItemText
              primary={visualisation.label}
              secondary={visualisation.description}
            />
          </ListItem>
        ))}
      </List>
    </>
  ) : null;

export default Visualisation;
