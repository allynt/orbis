import React from 'react';

import { DataIcon, MapIcon, SatelliteIcon, StoryIcon, ProfileIcon } from '@astrosat/astrosat-ui';

import { DATA_LAYERS, SATELLITE_LAYERS, BOOKMARKS, STORIES, PROFILE } from './toolbar-constants';
import featureToggles from '../feature-toggles';
import { toggleMenu, setMenuHeadings } from '../side-menu/side-menu.slice';
import { history } from 'root.reducer';

import styles from './toolbar.module.css';

export const getToolbarItems = dispatch => {
  const items = [
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
    },
  ];

  if (featureToggles.satellites) {
    items.splice(1, 0, {
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
    });
  }

  if (featureToggles.stories) {
    items.splice(3, 0, {
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
    });
  }

  if (featureToggles.admin) {
    items.splice(items.length - 1, 0, {
      label: 'Admin',
      icon: <StoryIcon classes={styles.icon} />,
      action: () => {
        history.push('/admin');
      },
      tooltip: 'Admin',
      footer: true,
      roles: ['AdminRole'],
    });
  }

  return items;
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
