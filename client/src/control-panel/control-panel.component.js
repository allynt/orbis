import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  /*CloseButton,*/ CloseIcon,
  IconButton,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import {
  ANNOTATIONS,
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';
import {
  closeMenu,
  selectIsMenuVisible,
  selectHeading,
  selectStrapline,
  selectVisibleMenuItem,
} from './control-panel.slice';
import StoriesPanel from '../stories/stories-panel.component';
import Profile from '../accounts/profile/profile.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import SatellitesPanel from '../satellites/satellites-panel.component';

import { SidePanel } from 'components/side-panel/side-panel.component';
import Toolbar from './toolbar.component';
import { getToolbarItems } from './toolbar-config';
import { userSelector } from 'accounts/accounts.selectors';

const useStyles = makeStyles(theme => ({
  content: {
    height: `calc(100vh - ${theme.typography.pxToRem(80)})`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  header: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

/**
 * @param {{
 *   sidebarComponents: Record<string, JSX.Element | JSX.Element[]>
 * }} props
 */
const ControlPanel = ({ sidebarComponents }) => {
  const dispatch = useDispatch();
  const isMenuVisible = useSelector(selectIsMenuVisible);
  const heading = useSelector(selectHeading);
  const strapline = useSelector(selectStrapline);
  const visibleMenuItem = useSelector(selectVisibleMenuItem);
  const user = useSelector(userSelector);
  const toolbarItems = getToolbarItems(dispatch, user);
  const styles = useStyles({});

  return (
    <>
      <Toolbar items={toolbarItems} />
      <SidePanel
        open={isMenuVisible}
        contentClassName={styles.content}
        header={
          <div className={styles.header}>
            <Typography variant="h3" component="h1" gutterBottom>
              {heading}
            </Typography>
            <Typography variant="subtitle2">{strapline}</Typography>
            <IconButton
              size="small"
              className={styles.closeButton}
              onClick={() => dispatch(closeMenu())}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        }
      >
        {visibleMenuItem === DATA_LAYERS && (
          <DataLayers sidebarComponents={sidebarComponents} />
        )}
        {visibleMenuItem === SATELLITE_LAYERS && <SatellitesPanel />}
        {visibleMenuItem === BOOKMARKS && <BookmarksPanel />}
        {visibleMenuItem === STORIES && <StoriesPanel />}
        {visibleMenuItem === PROFILE && <Profile />}
      </SidePanel>
    </>
  );
};

export default ControlPanel;
