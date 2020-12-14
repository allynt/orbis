import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { CloseButton } from '@astrosat/astrosat-ui';

import {
  ANNOTATIONS,
  BOOKMARKS,
  CHANGE_PASSWORD,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from '../toolbar/toolbar-constants';
import {
  closeMenu,
  selectIsMenuVisible,
  selectHeading,
  selectStrapline,
  selectVisibleMenuItem,
} from './control-panel.slice';
import StoriesPanel from '../stories/stories-panel.component';
import PasswordChangeForm from '../accounts/password/change/password-change-form.component';
import Profile from '../accounts/profile/profile.component';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import SatellitesPanel from '../satellites/satellites-panel.component';

import styles from './control-panel.module.css';

const SideMenu = () => {
  const dispatch = useDispatch();
  const isMenuVisible = useSelector(selectIsMenuVisible);
  const heading = useSelector(selectHeading);
  const strapline = useSelector(selectStrapline);
  const visibleMenuItem = useSelector(selectVisibleMenuItem);

  return (
    <div
      className={`${styles['side-menu-container']} ${
        isMenuVisible ? styles.show : ''
      }`}
    >
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

      <div className={styles.sidebar}>
        {visibleMenuItem === DATA_LAYERS && <DataLayers />}
        {visibleMenuItem === SATELLITE_LAYERS && <SatellitesPanel />}
        {visibleMenuItem === ANNOTATIONS && <AnnotationsPanel />}
        {visibleMenuItem === BOOKMARKS && <BookmarksPanel />}
        {visibleMenuItem === STORIES && <StoriesPanel />}
        {visibleMenuItem === PROFILE && <Profile />}
        {visibleMenuItem === CHANGE_PASSWORD && <PasswordChangeForm />}
      </div>
    </div>
  );
};

export default SideMenu;
