import React from 'react';

import {
  DataIcon,
  MapIcon,
  SatelliteIcon,
  StoryIcon,
  ProfileIcon,
} from '@astrosat/astrosat-ui';

import { ReactComponent as AdminIcon } from './admin.svg';
import {
  DATA_LAYERS,
  SATELLITE_LAYERS,
  BOOKMARKS,
  STORIES,
  PROFILE,
} from './toolbar-constants';
import featureToggles from '../feature-toggles';
import { toggleMenu, setMenuHeadings } from '../side-menu/side-menu.slice';
import { history } from 'root.reducer';

import styles from './toolbar.module.css';

export const getToolbarItems = (dispatch, user) => {
  let items = [
    {
      label: DATA_LAYERS,
      icon: <DataIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(DATA_LAYERS));
        dispatch(
          setMenuHeadings({
            heading: 'SELECT ORB',
            strapline: 'Choose your ORB and then add data layers',
          }),
        );
      },
      tooltip: DATA_LAYERS,
      roles: ['UserRole'],
      order: 0,
    },
    {
      label: BOOKMARKS,
      icon: <MapIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(BOOKMARKS));
        dispatch(
          setMenuHeadings({
            heading: 'MY MAPS',
            strapline: 'Save your map and pick up later',
          }),
        );
      },
      tooltip: BOOKMARKS,
      roles: ['UserRole'],
      order: 2,
    },
    {
      label: PROFILE,
      icon: <ProfileIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(PROFILE));
        dispatch(
          setMenuHeadings({
            heading: 'My Account',
            strapline: 'Edit your details below',
          }),
        );
      },
      tooltip: PROFILE,
      footer: true,
      roles: ['UserRole'],
      order: 5,
    },
  ];

  if (featureToggles.satellites) {
    items.push({
      label: SATELLITE_LAYERS,
      icon: <SatelliteIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(SATELLITE_LAYERS));
        dispatch(
          setMenuHeadings({
            heading: 'SATELLITE IMAGES',
            strapline: 'Select Type of imagery For The Layers',
          }),
        );
      },
      tooltip: SATELLITE_LAYERS,
      roles: ['UserRole'],
      order: 1,
    });
  }

  if (featureToggles.stories) {
    items.push({
      label: STORIES,
      icon: <StoryIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(STORIES));
        dispatch(
          setMenuHeadings({
            heading: 'STORIES',
            strapline: 'Select an Existing Story or Add New',
          }),
        );
      },
      tooltip: STORIES,
      roles: ['UserRole'],
      order: 3,
    });
  }

  if (user.customers?.some(customer => customer.type === 'MANAGER')) {
    items.push({
      label: 'Admin',
      icon: <AdminIcon className={styles.icon} />,
      action: () => {
        history.push('/admin-console');
      },
      tooltip: 'Admin',
      footer: true,
      roles: [], // not restricted by role
      order: 4,
    });
  }

  return items
    .filter(
      item =>
        item.roles === undefined ||
        item.roles === null ||
        item.roles.length == 0 ||
        user.roles.some(role => item.roles.includes(role)),
    )
    .sort((item1, item2) => item1.order - item2.order);
};

/* UNUSED ITEMS */
// {
//   label: PAGES,
//   icon: <PagesIcon classes={styles.icon} />,
//   action: () => dispatch(notYetImplemented('No Pages designed yet')),
//   tooltip: PAGES,
//   roles: ['UserRole'],
// },
// {
//   label: ANNOTATIONS,
//   icon: <AnnotationsIcon classes={styles.icon} />,
//   action: () => {
//     dispatch(toggleMenu(ANNOTATIONS));
//     dispatch(toggleMenuItem(ANNOTATIONS));
//     dispatch(setMenuHeadings({ heading: 'ANNOTATIONS', strapline: 'Select Your Drawing Tool Or Saved Areas' }));
//   },
//   tooltip: ANNOTATIONS,
// },
// {
//   label: SHARE,
//   icon: <ShareIcon classes={styles.icon} />,
//   action: () => dispatch(notYetImplemented('No Share designed yet')),
//   tooltip: SHARE,
// roles: ['UserRole'],
// },
// {
//   label: 'Change Password',
//   icon: <BookmarksLogo classes={styles.icon} />,
//   action: () => {
//     dispatch(toggleMenu());
//     dispatch(toggleMenuItem('Change Password'));
//   },
//   tooltip: 'Change Password'
// },
// {
//   label: 'Toggle Mini-Map',
//   icon: <ShareIcon classes={styles.icon} />,
//   action: () => dispatch(toggleMiniMap()),
//   tooltip: 'Toggle Mini-Map'
// },
// {
//   label: 'Toggle Spyglass',
//   icon: <StoryIcon classes={styles.icon} />,
//   // action: () => dispatch(toggleSpyglassMap()),
//   action: () => dispatch(notYetImplemented('No Stories designed yet')),
//   // action: () => dispatch(toggleCompareMaps()),
//   tooltip: 'Toggle Spyglass'
// },
// {
//   label: 'FAQ',
//   icon: <FaqIcon classes={styles.icon} />,
//   action: () => dispatch(notYetImplemented(FAQ)),
//   tooltip: 'FAQ',
//   footer: true,
//   roles: ['UserRole'],
// },
