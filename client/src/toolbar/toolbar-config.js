import React from 'react';

import { ANNOTATIONS, BOOKMARKS, DATA_LAYERS, SATELLITE_LAYERS, PROFILE, CHANGE_PASSWORD } from './constants';

import { ReactComponent as BookmarksLogo } from './menu.svg';
import { ReactComponent as DataIcon } from './data.svg';
import { ReactComponent as FaqIcon } from './faq.svg';
import { ReactComponent as ImageIcon } from './image.svg';
import { ReactComponent as ProfileIcon } from './profile.svg';
import { ReactComponent as SatelliteIcon } from './satellite.svg';
import { ReactComponent as ShareIcon } from './share.svg';
import { ReactComponent as StoryIcon } from './story.svg';
import { ReactComponent as AnnotationsIcon } from './annotations.svg';

import { toggleMenu, toggleMenuItem } from '../side-menu/side-menu.actions';
import { logout } from '../accounts/accounts.actions';
import { toggleMiniMap, toggleSpyglassMap, toggleCompareMaps } from '../map/map.actions';

export const getToolbarItems = dispatch => {
  return [
    // {
    //   label: 'Open Sidebar',
    //   icon: <BookmarksLogo />,
    //   action: () => dispatch(toggleMenu()),
    //   tooltip: 'Open Sidebar'
    // },
    {
      label: DATA_LAYERS,
      icon: <DataIcon />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem(DATA_LAYERS));
      },
      tooltip: DATA_LAYERS
    },
    {
      label: SATELLITE_LAYERS,
      icon: <SatelliteIcon />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem(SATELLITE_LAYERS));
      },
      tooltip: SATELLITE_LAYERS
    },
    {
      label: ANNOTATIONS,
      icon: <AnnotationsIcon />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem(ANNOTATIONS));
      },
      tooltip: ANNOTATIONS
    },
    {
      label: BOOKMARKS,
      icon: <ImageIcon />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem(BOOKMARKS));
      },
      tooltip: BOOKMARKS
    },
    // {
    //   label: 'Layers',
    //   icon: <BookmarksLogo />,
    //   action: () => {
    //     dispatch(toggleMenu());
    //     dispatch(toggleMenuItem('Layers'));
    //   },
    //   tooltip: 'Layers'
    // },
    // {
    //   label: 'Change Password',
    //   icon: <BookmarksLogo />,
    //   action: () => {
    //     dispatch(toggleMenu());
    //     dispatch(toggleMenuItem('Change Password'));
    //   },
    //   tooltip: 'Change Password'
    // },
    {
      label: 'Toggle Mini-Map',
      icon: <ShareIcon />,
      action: () => dispatch(toggleMiniMap()),
      tooltip: 'Toggle Mini-Map'
    },
    {
      label: 'Toggle Spyglass',
      icon: <StoryIcon />,
      // action: () => dispatch(toggleSpyglassMap()),
      action: () => dispatch(toggleCompareMaps()),
      tooltip: 'Toggle Spyglass'
    },
    {
      label: 'FAQ',
      icon: <FaqIcon />,
      action: () => dispatch(logout()),
      tooltip: 'FAQ',
      footer: true
    },
    {
      label: PROFILE,
      icon: <ProfileIcon />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem(PROFILE));
      },
      tooltip: PROFILE,
      footer: true
    }
  ];
};
