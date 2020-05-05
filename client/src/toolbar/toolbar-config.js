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

import { ReactComponent as DataIcon } from './data.svg';
import { ReactComponent as SatelliteIcon } from './satellite.svg';
// import { ReactComponent as PagesIcon } from './pages.svg';
import { ReactComponent as BookmarksIcon } from './map.svg';
import { ReactComponent as StoryIcon } from './story.svg';
// import { ReactComponent as AnnotationsIcon } from './annotations.svg';
// import { ReactComponent as ImageIcon } from './image.svg';
// import { ReactComponent as ShareIcon } from './share.svg';
// import { ReactComponent as FaqIcon } from './faq.svg';
import { ReactComponent as ProfileIcon } from './profile.svg';

import { toggleMenu, toggleMenuItem, setMenuHeadings } from '../side-menu/side-menu.slice';

// import { saveMap } from '../map/map.slice';

// import { notYetImplemented } from '../app.slice';
import featureToggles from '../feature-toggles';

export const getToolbarItems = dispatch => {
  const items = [
    {
      label: DATA_LAYERS,
      icon: <DataIcon />,
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
    },
    // {
    //   label: SATELLITE_LAYERS,
    //   icon: <SatelliteIcon />,
    //   action: () => {
    //     dispatch(toggleMenu(SATELLITE_LAYERS));
    //     dispatch(toggleMenuItem(SATELLITE_LAYERS));
    //     dispatch(setMenuHeadings({ heading: 'SATELLITE IMAGES', strapline: 'Select Type of imagery For The Layers' }));
    //   },
    //   tooltip: SATELLITE_LAYERS,
    // },
    // {
    //   label: PAGES,
    //   icon: <PagesIcon />,
    //   action: () => dispatch(notYetImplemented('No Pages designed yet')),
    //   tooltip: PAGES
    // },
    {
      label: BOOKMARKS,
      icon: <BookmarksIcon />,
      action: () => {
        dispatch(toggleMenu(BOOKMARKS));
        dispatch(toggleMenuItem(BOOKMARKS));
        dispatch(
          setMenuHeadings({
            heading: 'MAPS',
            strapline: 'Select an Existing Map or Add New',
          }),
        );
      },
      tooltip: BOOKMARKS,
    },
    // {
    //   label: ANNOTATIONS,
    //   icon: <AnnotationsIcon />,
    //   action: () => {
    //     dispatch(toggleMenu(ANNOTATIONS));
    //     dispatch(toggleMenuItem(ANNOTATIONS));
    //     dispatch(setMenuHeadings({ heading: 'ANNOTATIONS', strapline: 'Select Your Drawing Tool Or Saved Areas' }));
    //   },
    //   tooltip: ANNOTATIONS
    // },
    // {
    //   label: SAVE_MAP,
    //   icon: <ImageIcon />,
    //   action: () => {
    //     dispatch(toggleMenu('screenshot'));
    //     dispatch(saveMap());
    //   },
    //   tooltip: SAVE_MAP
    // },
    // {
    //   label: SHARE,
    //   icon: <ShareIcon />,
    //   action: () => dispatch(notYetImplemented('No Share designed yet')),
    //   tooltip: SHARE
    // },
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
    // {
    //   label: 'Toggle Mini-Map',
    //   icon: <ShareIcon />,
    //   action: () => dispatch(toggleMiniMap()),
    //   tooltip: 'Toggle Mini-Map'
    // },
    // {
    //   label: 'Toggle Spyglass',
    //   icon: <StoryIcon />,
    //   // action: () => dispatch(toggleSpyglassMap()),
    //   action: () => dispatch(notYetImplemented('No Stories designed yet')),
    //   // action: () => dispatch(toggleCompareMaps()),
    //   tooltip: 'Toggle Spyglass'
    // },
    // {
    //   label: 'FAQ',
    //   icon: <FaqIcon />,
    //   action: () => dispatch(notYetImplemented(FAQ)),
    //   tooltip: 'FAQ',
    //   footer: true
    // },
    {
      label: PROFILE,
      icon: <ProfileIcon />,
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
    },
  ];

  if (featureToggles.satellites) {
    items.splice(1, 0, {
      label: SATELLITE_LAYERS,
      icon: <SatelliteIcon />,
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
    });
  }

  if (featureToggles.stories) {
    items.splice(3, 0, {
      label: STORIES,
      icon: <StoryIcon />,
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
    });
  }

  return items;
};
