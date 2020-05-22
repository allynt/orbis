import React from 'react';

import {
  DATA_LAYERS,
  SATELLITE_LAYERS,
  // PAGES,
  BOOKMARKS,
  STORIES,
  // ANNOTATIONS,
  // SAVE_MAP,
  // SHARE,
  // FAQ,
  PROFILE,
  // CHANGE_PASSWORD,
} from './toolbar-constants';

import DataIcon from '@astrosat/astrosat-ui/dist/icons/data-icon';
import MapIcon from '@astrosat/astrosat-ui/dist/icons/map-icon';
import SatelliteIcon from '@astrosat/astrosat-ui/dist/icons/satellite-icon';
import StoryIcon from '@astrosat/astrosat-ui/dist/icons/story-icon';
// import PagesIcon from '@astrosat/astrosat-ui/dist/icons/pages-icon';
// import AnnotationsIcon from '@astrosat/astrosat-ui/dist/icons/annotations-icon';
// import ImageIcon from '@astrosat/astrosat-ui/dist/icons/image-icon';
// import ShareIcon from '@astrosat/astrosat-ui/dist/icons/share-icon';
// import FaqIcon from '@astrosat/astrosat-ui/dist/icons/faq-icon';
import ProfileIcon from '@astrosat/astrosat-ui/dist/icons/profile-icon';

import { toggleMenu, toggleMenuItem, setMenuHeadings } from '../side-menu/side-menu.slice';

// import { saveMap } from '../map/map.slice';

// import { notYetImplemented } from '../app.slice';
import featureToggles from '../feature-toggles';

import { history } from 'root.reducer';

import styles from './toolbar.module.css';

export const getToolbarItems = dispatch => {
  const items = [
    {
      label: DATA_LAYERS,
      icon: <DataIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(DATA_LAYERS));
        dispatch(toggleMenuItem(DATA_LAYERS));
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
    // {
    //   label: SATELLITE_LAYERS,
    //   icon: <SatelliteIcon classes={styles.icon} />,
    //   action: () => {
    //     dispatch(toggleMenu(SATELLITE_LAYERS));
    //     dispatch(toggleMenuItem(SATELLITE_LAYERS));
    //     dispatch(setMenuHeadings({ heading: 'SATELLITE IMAGES', strapline: 'Select Type of imagery For The Layers' }));
    //   },
    //   tooltip: SATELLITE_LAYERS,
    // },
    // {
    //   label: PAGES,
    //   icon: <PagesIcon classes={styles.icon} />,
    //   action: () => dispatch(notYetImplemented('No Pages designed yet')),
    //   tooltip: PAGES,
    //   roles: ['UserRole'],
    // },
    {
      label: BOOKMARKS,
      icon: <MapIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(BOOKMARKS));
        dispatch(toggleMenuItem(BOOKMARKS));
        dispatch(
          setMenuHeadings({
            heading: 'MAPS',
            strapline: 'Add new map or Select an existing map',
          }),
        );
      },
      tooltip: BOOKMARKS,
      roles: ['UserRole'],
    },
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
    //   label: SAVE_MAP,
    //   icon: <ImageIcon classes={styles.icon} />,
    //   action: () => {
    //     dispatch(toggleMenu('screenshot'));
    //     dispatch(saveMap());
    //   },
    //   tooltip: SAVE_MAP
    // },
    // {
    //   label: SHARE,
    //   icon: <ShareIcon classes={styles.icon} />,
    //   action: () => dispatch(notYetImplemented('No Share designed yet')),
    //   tooltip: SHARE,
    // roles: ['UserRole'],
    // },
    // {
    //   label: 'Layers',
    //   icon: <BookmarksLogo classes={styles.icon} />,
    //   action: () => {
    //     dispatch(toggleMenu());
    //     dispatch(toggleMenuItem('Layers'));
    //   },
    //   tooltip: 'Layers'
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
    {
      label: PROFILE,
      icon: <ProfileIcon classes={styles.icon} />,
      action: () => {
        dispatch(toggleMenu(PROFILE));
        dispatch(toggleMenuItem(PROFILE));
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
        dispatch(toggleMenuItem(SATELLITE_LAYERS));
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
        dispatch(toggleMenuItem(STORIES));
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
