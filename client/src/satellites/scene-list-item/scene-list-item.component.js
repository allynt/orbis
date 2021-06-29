import React from 'react';

import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Typography,
} from '@astrosat/astrosat-ui';

import { Info } from '@material-ui/icons';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { DATE_FORMAT, TIME_FORMAT } from '../satellite.constants';
import { SCENE, VISUALISATION } from '../satellites-panel.component';

const SceneListItem = ({
  index,
  scene,
  icon,
  selectScene,
  setVisiblePanel,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
  visualisationId,
}) => {
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
            style={{
              width: '6rem',
              height: '6rem',
              maxWidth: '6rem',
              marginBottom: '0.5em',
            }}
            variant="rounded"
            src={thumbnailUrl}
            alt="Thumbnail of a satellite scene"
          />
          <Button
            style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}
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
