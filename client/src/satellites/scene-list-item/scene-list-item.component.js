import React from 'react';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  SatelliteIcon,
  Skeleton,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { startCase } from 'lodash';

import { DATE_FORMAT, TIME_FORMAT } from '../satellite.constants';

const useStyles = makeStyles(theme => ({
  avatarWrapper: { marginRight: theme.spacing(2) },
  avatar: {
    width: '6rem',
    height: '6rem',
    maxWidth: '6rem',
    transition: theme.transitions.create('boxShadow', {
      duration: theme.transitions.duration.shortest,
    }),
    '&$hovered': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
  },
  hovered: {},
  id: {
    wordBreak: 'break-word',
  },
}));

/**
 * @param {{
 *  scene: import('typings/satellites').Scene
 *  secondaryAction?: React.ReactNode
 *  visualisationId: string
 *  selected?: boolean
 *  hovered?: boolean
 *  onSceneClick: (scene: import('typings/satellites').Scene) => void
 *  onHover?: (scene?: import('typings/satellites').Scene) => void
 * }} props
 */
const SceneListItem = ({
  scene,
  secondaryAction,
  visualisationId,
  selected = false,
  hovered = false,
  onSceneClick,
  onHover,
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
      {...(onHover
        ? {
            onMouseEnter: () => onHover(scene),
            onMouseLeave: () => onHover(undefined),
          }
        : {})}
    >
      <ListItemAvatar className={styles.avatarWrapper}>
        <Avatar
          className={clsx(styles.avatar, { [styles.hovered]: hovered })}
          variant="rounded"
          src={thumbnailUrl}
          alt="Thumbnail of a satellite scene"
        >
          <SatelliteIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography>{startCase(scene.satellite)}</Typography>
            <Typography>
              {format(parseISO(scene.created), DATE_FORMAT)}
            </Typography>
            <Typography>
              {format(parseISO(scene.created), TIME_FORMAT)} UTC
            </Typography>
            <Typography>{scene.cloudCover} %</Typography>
            <Typography className={styles.id}>{scene.id}</Typography>
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
