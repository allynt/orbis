import React, { useMemo } from 'react';

import {
  DataIcon,
  MapIcon,
  ProfileIcon,
  SatelliteIcon,
  StoryIcon,
  SvgIcon,
} from '@astrosat/astrosat-ui';

import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import apiClient from 'api-client';
import { setBackgroundLocation } from 'app.slice';
import { useOrbFeatureAccess } from 'hooks/useOrbFeatureAccess';
import useUserRoleAuthorization from 'hooks/useUserRoleAuthorization';

import featureToggles from '../feature-toggles';
import { ReactComponent as GuideIcon } from './guide.svg';
import { ReactComponent as MissionControlIcon } from './mission-control.svg';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';

/**
 * @typedef {{
 *  id: string
 *  icon: JSX.Element
 *  onClick?: () => void
 *  tooltip?: string
 *  order?: number
 *  footer?: boolean
 *  href?: string
 * }} ToolbarItem
 */

/**
 * @param {boolean} condition
 * @param {ToolbarItem | ToolbarItem[]} itemOrItems
 */
const conditionallyAddItemOrItems = (condition, itemOrItems) => {
  if (condition) {
    if (Array.isArray(itemOrItems)) return itemOrItems;
    return [itemOrItems];
  }
  return [];
};

/**
 * @param {{dispatch: React.Dispatch<import('./control-panel.component').ControlPanelAction>}} params
 * @returns {ToolbarItem[]}
 */
export const useToolbarItems = ({ dispatch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const userHasUserRole = useUserRoleAuthorization(['UserRole']);
  const hasSatellitesFeatureAccess = useOrbFeatureAccess('satellites');

  /** @type {ToolbarItem[]} */
  const items = useMemo(
    () => [
      ...conditionallyAddItemOrItems(userHasUserRole, [
        {
          id: DATA_LAYERS,
          icon: <DataIcon titleAccess="data" />,
          onClick: () => {
            dispatch({
              type: 'SET_PANEL',
              panel: DATA_LAYERS,
              heading: 'SELECT ORB',
              strapline: 'Choose your ORB and then add data layers',
            });
          },
          tooltip: DATA_LAYERS,
          order: 0,
        },
        {
          id: BOOKMARKS,
          icon: <MapIcon titleAccess="My maps" />,
          onClick: () => {
            dispatch({
              type: 'SET_PANEL',
              panel: BOOKMARKS,
              heading: 'MY MAPS',
              strapline: 'Save your map and pick up later',
            });
          },
          tooltip: BOOKMARKS,
          order: 2,
        },
        {
          id: PROFILE,
          icon: <ProfileIcon titleAccess="Profile" />,
          onClick: () => {
            dispatch({
              type: 'SET_PANEL',
              panel: PROFILE,
              heading: 'My Account',
              strapline: 'Edit your details below',
            });
          },
          tooltip: PROFILE,
          footer: true,
          order: 5,
        },
      ]),
      ...conditionallyAddItemOrItems(
        userHasUserRole && hasSatellitesFeatureAccess,
        {
          id: SATELLITE_LAYERS,
          icon: <SatelliteIcon />,
          onClick: () => {
            dispatch({
              type: 'SET_PANEL',
              panel: SATELLITE_LAYERS,
              heading: 'SATELLITE IMAGES',
              strapline: 'Search and visualise up to date images',
            });
          },
          tooltip: SATELLITE_LAYERS,
          order: 1,
        },
      ),
      ...conditionallyAddItemOrItems(true, {
        id: 'Mission Control',
        icon: (
          <SvgIcon>
            <MissionControlIcon />
          </SvgIcon>
        ),
        footer: true,
        tooltip: 'Mission Control',
        onClick: () => {
          reduxDispatch(setBackgroundLocation(location));
          navigate('/mission-control');
        },
      }),
      {
        id: 'User Guide',
        icon: (
          <SvgIcon>
            <GuideIcon />
          </SvgIcon>
        ),
        footer: true,
        tooltip: 'User Guide',
        order: 3,
        href: apiClient.documents.userGuideUrl(),
      },
      ...conditionallyAddItemOrItems(
        featureToggles.stories && userHasUserRole,
        {
          id: STORIES,
          icon: <StoryIcon />,
          onClick: () => {
            dispatch({
              type: 'SET_PANEL',
              panel: STORIES,
              heading: 'STORIES',
              strapline: 'Select an Existing Story or Add New',
            });
          },
          tooltip: STORIES,
          order: 3,
        },
      ),
    ],
    [
      dispatch,
      hasSatellitesFeatureAccess,
      userHasUserRole,
      location,
      navigate,
      reduxDispatch,
    ],
  );

  return items.sort((item1, item2) => item1.order - item2.order);
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
