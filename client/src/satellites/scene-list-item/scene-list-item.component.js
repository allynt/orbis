import React from 'react';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Skeleton,
  Typography,
} from '@astrosat/astrosat-ui';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { DATE_FORMAT, TIME_FORMAT } from '../satellite.constants';

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
 *  secondaryAction?: React.ReactNode
 *  visualisationId: string
 *  selected?: boolean
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void
 * }} props
 */
const SceneListItem = ({
  scene,
  secondaryAction,
  visualisationId,
  selected = false,
  onSceneClick,
}) => {
  const styles = useStyles();

  if (scene == null) return null;

  const thumbnailUrl = scene.thumbnail_url.replace(
    /{VISUALISATION_ID}/,
    visualisationId,
  );

  const handleSceneClick = () => {
    onSceneClick(scene);
  };

  return (
    <ListItem
      aria-label={scene.id}
      button
      onClick={handleSceneClick}
      selected={selected}
    >
      <ListItemAvatar>
        <Avatar
          className={styles.avatar}
          variant="rounded"
          src={thumbnailUrl}
          alt="Thumbnail of a satellite scene"
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography>
              {scene && format(parseISO(scene.created), DATE_FORMAT)}
            </Typography>
            <Typography>
              {scene && format(parseISO(scene.created), TIME_FORMAT)} UTC
            </Typography>
            <Typography>{scene.cloudCover} %</Typography>
            <Typography>{scene.id}</Typography>
          </>
        }
        primaryTypographyProps={{ id: 'primary-text' }}
        secondaryTypographyProps={{ color: 'primary' }}
      />
      {secondaryAction && (
        <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>
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
