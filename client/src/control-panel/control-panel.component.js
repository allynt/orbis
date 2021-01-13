import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { CloseButton, makeStyles } from '@astrosat/astrosat-ui';

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
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import SatellitesPanel from '../satellites/satellites-panel.component';

import { SidePanel } from 'components/side-panel/side-panel.component';
import Toolbar from './toolbar.component';
import { getToolbarItems } from './toolbar-config';
import { userSelector } from 'accounts/accounts.selectors';

const ControlPanel = () => {
  const dispatch = useDispatch();
  const isMenuVisible = useSelector(selectIsMenuVisible);
  const heading = useSelector(selectHeading);
  const strapline = useSelector(selectStrapline);
  const visibleMenuItem = useSelector(selectVisibleMenuItem);
  const user = useSelector(userSelector);
  const toolbarItems = getToolbarItems(dispatch, user);

  const useStyles = makeStyles({
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headings: {
      display: 'flex',
      flexDirection: 'column',
      '&$heading': {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: '5px',
      },
      '&$strapline': {
        color: 'lightgray',
        fontSize: '0.75rem',
      },
    },
    content: {
      height: '100%',
      width: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    button: {
      paddingTop: '0.532rem',
      paddingBottom: '0.532rem',
      width: '70%',
      margin: '0.5rem 0',
    },
    row: {
      width: '100%',
    },
    fields: {
      width: '100% !important',
    },

    //I don't know how to write code correctly: lines 91-92 inside makeStyles hook.
    // .fields > * {
    //   margin-bottom: 1rem;
    // }
  });
  const styles = useStyles({});
  return (
    <>
      <Toolbar items={toolbarItems} />
      <SidePanel
        open={isMenuVisible}
        contentClassName={styles.content}
        header={
          <div className={styles.header}>
            <div className={styles.headings}>
              <h3 className={styles.heading}>{heading}</h3>
              <p className={styles.strapline}>{strapline}</p>
            </div>
            <CloseButton
              className={styles.closeButton}
              onClick={() => dispatch(closeMenu())}
            />
          </div>
        }
      >
        {visibleMenuItem === DATA_LAYERS && <DataLayers />}
        {visibleMenuItem === SATELLITE_LAYERS && <SatellitesPanel />}
        {visibleMenuItem === ANNOTATIONS && <AnnotationsPanel />}
        {visibleMenuItem === BOOKMARKS && <BookmarksPanel />}
        {visibleMenuItem === STORIES && <StoriesPanel />}
        {visibleMenuItem === PROFILE && <Profile />}
      </SidePanel>
    </>
  );
};

export default ControlPanel;
