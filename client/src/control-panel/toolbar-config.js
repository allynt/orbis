import React from 'react';

import {
  DataIcon,
  MapIcon,
  SatelliteIcon,
  StoryIcon,
  ProfileIcon,
  SvgIcon,
} from '@astrosat/astrosat-ui';

import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import { useOrbFeatureAccess } from 'hooks/useOrbFeatureAccess';
import useUserRoleAuthorization from 'hooks/useUserRoleAuthorization';

import {
  toggleMenu,
  setMenuHeadings,
} from '../control-panel/control-panel.slice';
import featureToggles from '../feature-toggles';
import { toggleMissionControlDialog } from '../mission-control/mission-control-slice';
import { ReactComponent as AdminIcon } from './admin.svg';
import { ReactComponent as GuideIcon } from './guide.svg';
import { ReactComponent as MissionControlIcon } from './mission-control.svg';
import {
  DATA_LAYERS,
  SATELLITE_LAYERS,
  BOOKMARKS,
  STORIES,
  PROFILE,
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
 * @returns {ToolbarItem[]}
 */
export const useToolbarItems = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const userHasUserRole = useUserRoleAuthorization(['UserRole']);
  const hasSatellitesFeatureAccess = useOrbFeatureAccess('satellites');

  /** @type {ToolbarItem[]} */
  const items = [
    ...conditionallyAddItemOrItems(userHasUserRole, [
      {
        label: DATA_LAYERS,
        icon: <DataIcon titleAccess="data" />,
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
        order: 0,
      },
      {
        label: BOOKMARKS,
        icon: <MapIcon titleAccess="My maps" />,
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
        order: 2,
      },
      {
        label: PROFILE,
        icon: <ProfileIcon titleAccess="Profile" />,
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
        order: 5,
      },
    ]),
    ...conditionallyAddItemOrItems(
      userHasUserRole && hasSatellitesFeatureAccess,
      {
        label: SATELLITE_LAYERS,
        icon: <SatelliteIcon />,
        action: () => {
          dispatch(toggleMenu(SATELLITE_LAYERS));
          dispatch(
            setMenuHeadings({
              heading: 'SATELLITE IMAGES',
              strapline: 'Search and visualise up to date images',
            }),
          );
        },
        tooltip: SATELLITE_LAYERS,
        order: 1,
      },
    ),
    ...conditionallyAddItemOrItems(false, {
      label: 'Mission Control',
      icon: (
        <SvgIcon>
          <MissionControlIcon />
        </SvgIcon>
      ),
      footer: true,
      tooltip: 'Mission Control',
      action: () => dispatch(toggleMissionControlDialog(true)),
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
    ...conditionallyAddItemOrItems(featureToggles.stories && userHasUserRole, {
      label: STORIES,
      icon: <StoryIcon />,
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
      order: 3,
    }),
    ...conditionallyAddItemOrItems(
      user?.customers?.some(customer => customer.type === 'MANAGER'),
      {
        label: 'Admin',
        icon: (
          <SvgIcon>
            <AdminIcon />
          </SvgIcon>
        ),
        action: () => {
          dispatch(push('/admin-console'));
        },
        tooltip: 'Admin',
        footer: true,
        order: 4,
      },
    ),
  ];

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
