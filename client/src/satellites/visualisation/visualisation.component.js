import React from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  avatarWrapper: { marginRight: theme.spacing(2) },
  avatar: {
    width: theme.typography.pxToRem(58),
    height: theme.typography.pxToRem(58),
  },
}));

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
}) => {
  const styles = useStyles();
  return visualisations ? (
    <>
      <Typography variant="h3" component="h1" gutterBottom>
        Visualisation
      </Typography>
      <Typography paragraph>
        Search for a Satellite image and visualise the results
      </Typography>
      <List>
        {visualisations.map(({ id, description, label, thumbnail }) => (
          <ListItem
            key={id}
            button
            selected={id === visualisationId}
            onClick={() => onVisualisationClick('TCI')}
          >
            <ListItemAvatar className={styles.avatarWrapper}>
              <Avatar
                className={styles.avatar}
                variant="rounded"
                src={thumbnail}
                alt="Scene Visualisation Thumbnail"
              />
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ variant: 'h4', component: 'span' }}
              primary={label}
              secondary={description}
            />
          </ListItem>
        ))}
      </List>
    </>
  ) : null;
};

export default Visualisation;
