import React, { useMemo } from 'react';

import {
  DataIcon,
  MapIcon,
  ProfileIcon,
  SatelliteIcon,
  StoryIcon,
  SvgIcon,
} from '@astrosat/astrosat-ui';

import apiClient from 'api-client';
import { useOrbFeatureAccess } from 'hooks/useOrbFeatureAccess';
import useUserRoleAuthorization from 'hooks/useUserRoleAuthorization';
import { history } from 'root.reducer';

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
 *  label: string
 *  icon: JSX.Element
 *  action?: () => void
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
  const userHasUserRole = useUserRoleAuthorization(['UserRole']);
  const hasSatellitesFeatureAccess = useOrbFeatureAccess('satellites');

  /** @type {ToolbarItem[]} */
  const items = useMemo(
    () => [
      ...conditionallyAddItemOrItems(userHasUserRole, [
        {
          label: DATA_LAYERS,
          icon: <DataIcon titleAccess="data" />,
          action: () => {
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
          label: BOOKMARKS,
          icon: <MapIcon titleAccess="My maps" />,
          action: () => {
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
          label: PROFILE,
          icon: <ProfileIcon titleAccess="Profile" />,
          action: () => {
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
          label: SATELLITE_LAYERS,
          icon: <SatelliteIcon />,
          action: () => {
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
        label: 'Mission Control',
        icon: (
          <SvgIcon>
            <MissionControlIcon />
          </SvgIcon>
        ),
        footer: true,
        tooltip: 'Mission Control',
        action: () => history.push('/mission-control'),
      }),
      {
        label: 'User Guide',
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
          label: STORIES,
          icon: <StoryIcon />,
          action: () => {
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
    [dispatch, hasSatellitesFeatureAccess, userHasUserRole],
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
