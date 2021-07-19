import React from 'react';

import {
  Avatar,
  Checkbox,
  EyeIcon,
  EyeSlashIcon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  avatarWrapper: { marginRight: theme.spacing(2) },
  avatar: {
    width: theme.typography.pxToRem(58),
    height: theme.typography.pxToRem(58),
  },
  list: {
    margin: theme.spacing(0, -1),
  },
}));

/**
 * @param {{
 *  visualisations: import('typings/satellites').Visualisation[]
 *  visualisationId?: string
 *  visible?: boolean
 *  onVisualisationClick: (visualisationId: import('typings/satellites').Visualisation['id']) => void
 *  onVisibilityChange: (checked: boolean) => void
 * }} props
 */
const Visualisation = ({
  visualisations,
  visualisationId,
  visible = true,
  onVisualisationClick,
  onVisibilityChange,
}) => {
  const styles = useStyles();
  return visualisations ? (
    <>
      <Typography variant="h3" component="h1" gutterBottom>
        Visualisation
      </Typography>
      <Typography paragraph>
        View your image using different visualisations
      </Typography>
      <List className={styles.list}>
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
            <ListItemSecondaryAction>
              <Checkbox
                inputProps={{ 'aria-labelledby': 'icon' }}
                checked={visible}
                onChange={(_event, checked) => onVisibilityChange(checked)}
                icon={
                  <EyeSlashIcon id="icon" color="action" titleAccess="Show" />
                }
                checkedIcon={
                  <EyeIcon id="icon" color="action" titleAccess="Hide" />
                }
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  ) : null;
};

export default Visualisation;
