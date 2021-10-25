import React, { useState } from 'react';

import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
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

import { SaveImageForm } from './save-image-form/save-image-form.component';

const useStyles = makeStyles(theme => ({
  avatarWrapper: { marginRight: theme.spacing(2) },
  avatar: {
    width: theme.typography.pxToRem(58),
    height: theme.typography.pxToRem(58),
  },
  list: {
    margin: theme.spacing(0, -1),
  },
  saveButton: { margin: 'auto auto 0' },
  dialogTitle: { position: 'relative' },
  closeButton: { position: 'absolute', inset: theme.spacing(3, 3, 3, 'auto') },
}));

/**
 * @param {{
 *  visualisations: import('typings').Visualisation[]
 *  visualisationId?: string
 *  visible?: boolean
 *  onVisualisationClick: (visualisationId: import('typings').Visualisation['id']) => void
 *  onVisibilityChange: (checked: boolean) => void
 *  onSaveImageSubmit: (values: import('./save-image-form/save-image-form.component').FormValues) => void
 * }} props
 */
const Visualisation = ({
  visualisations,
  visualisationId,
  visible = true,
  onVisualisationClick,
  onVisibilityChange,
  onSaveImageSubmit,
}) => {
  const styles = useStyles();
  const [saveImageFormOpen, setSaveImageFormOpen] = useState(false);

  /**
   * @param {import('./save-image-form/save-image-form.component').FormValues} values
   */
  const handleSaveImageSubmit = values => {
    setSaveImageFormOpen(false);
    onSaveImageSubmit(values);
  };

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
            onClick={() => onVisualisationClick(id)}
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
              primaryTypographyProps={{
                variant: 'h4',
                component: 'span',
              }}
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
      <Button
        className={styles.saveButton}
        onClick={() => setSaveImageFormOpen(true)}
      >
        Save Image
      </Button>
      <Dialog
        open={saveImageFormOpen}
        onClose={() => setSaveImageFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          className={styles.dialogTitle}
          onClose={() => setSaveImageFormOpen(false)}
        >
          Name Your Image
        </DialogTitle>
        <DialogContent>
          <SaveImageForm onSubmit={handleSaveImageSubmit} />
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default Visualisation;
