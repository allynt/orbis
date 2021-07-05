import React from 'react';

import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Skeleton,
  Typography,
} from '@astrosat/astrosat-ui';

import { Info } from '@material-ui/icons';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { DATE_FORMAT, TIME_FORMAT } from '../satellite.constants';
import { SCENE, VISUALISATION } from '../satellites.component';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: '6rem',
    height: '6rem',
    maxWidth: '6rem',
    marginBottom: theme.spacing(1),
  },
  button: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

/**
 * @param {{
 *  scene: import('typings/satellites').Scene
 *  icon: React.ReactNode
 *  selectScene: (scene: import('typings/satellites').Scene) => void
 *  setVisiblePanel: (panel: string) => void
 *  setSelectedMoreInfo: (params: {type: string, data: any}) => void
 *  toggleMoreInfoDialog: () => void
 *  visualisationId: string
 * }} props
 */
const SceneListItem = ({
  scene,
  icon,
  selectScene,
  setVisiblePanel,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
  visualisationId,
}) => {
  const styles = useStyles();
  const thumbnailUrl = scene?.thumbnail_url.replace(
    /{VISUALISATION_ID}/,
    visualisationId,
  );

  return (
    <ListItem
      aria-label={scene?.id}
      button
      onClick={() => {
        if (selectScene) {
          selectScene(scene);
          setVisiblePanel && setVisiblePanel(VISUALISATION);
        }
      }}
    >
      <ListItemAvatar>
        <>
          <Avatar
            className={styles.avatar}
            variant="rounded"
            src={thumbnailUrl}
            alt="Thumbnail of a satellite scene"
          />
          <Button
            className={styles.button}
            variant="text"
            size="small"
            color="default"
            startIcon={<Info />}
            onClick={() => {
              setSelectedMoreInfo({ type: SCENE, data: scene });
              toggleMoreInfoDialog();
            }}
          >
            More Info
          </Button>
        </>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography>
              {scene && format(parseISO(scene?.created), DATE_FORMAT)}
            </Typography>
            <Typography>
              {scene && format(parseISO(scene?.created), TIME_FORMAT)} UTC
            </Typography>
            <Typography>{scene?.cloudCover} %</Typography>
            <Typography>{scene?.id}</Typography>
          </>
        }
        primaryTypographyProps={{ id: 'primary-text' }}
        secondary={scene?.tier === 'free' && 'Free Product'}
        secondaryTypographyProps={{ color: 'primary' }}
      />
      {icon && (
        <ListItemSecondaryAction>
          <IconButton>{icon}</IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export const SceneListItemSkeleton = () => (
  <ListItem>
    <ListItemAvatar>
      <>
        <Skeleton>
          <Avatar
            style={{
              width: '6rem',
              height: '6rem',
              maxWidth: '6rem',
            }}
          />
        </Skeleton>
        <Skeleton />
      </>
    </ListItemAvatar>
    <ListItemText
      primary={
        <>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
        </>
      }
    />
  </ListItem>
);

export default SceneListItem;
