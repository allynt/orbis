import React from 'react';

import { ReactComponent as BookmarksLogo } from './menu.svg';
import { ReactComponent as AnnotationsLogo } from './satellite-acquisitions.svg';

import { toggleMenu, toggleMenuItem } from '../side-menu/side-menu.actions';
import { logout } from '../accounts/accounts.actions';
import { toggleMiniMap } from '../map/map.actions';

export const getToolbarItems = dispatch => {
  return [
    {
      label: 'Open Sidebar',
      icon: <BookmarksLogo />,
      action: () => dispatch(toggleMenu()),
      tooltip: 'Open Sidebar'
    },
    {
      label: 'Annotations',
      icon: <BookmarksLogo />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem('Annotations'));
      },
      tooltip: 'Annotations'
    },
    {
      label: 'Bookmarks',
      icon: <BookmarksLogo />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem('Bookmarks'));
      },
      tooltip: 'Bookmarks'
    },
    {
      label: 'Layers',
      icon: <BookmarksLogo />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem('Layers'));
      },
      tooltip: 'Layers'
    },
    {
      label: 'Profile',
      icon: <BookmarksLogo />,
      action: () => {
        dispatch(toggleMenu());
        dispatch(toggleMenuItem('Profile'));
      },
      tooltip: 'Profile'
    },
    {
      label: 'Toggle Mini-Map',
      icon: <BookmarksLogo />,
      action: () => dispatch(toggleMiniMap()),
      tooltip: 'Toggle Mini-Map'
    },
    {
      label: 'Logout',
      icon: <AnnotationsLogo />,
      action: () => dispatch(logout()),
      tooltip: 'Logout'
    }
  ];
};
