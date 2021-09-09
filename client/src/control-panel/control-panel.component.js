import React, { useReducer } from 'react';

import {
  CloseIcon,
  IconButton,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { SidePanel } from 'components/side-panel/side-panel.component';

import Profile from '../accounts/profile/profile.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import Satellites from '../satellites/satellites.component';
import StoriesPanel from '../stories/stories-panel.component';
import { useToolbarItems } from './toolbar-config';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';
import Toolbar from './toolbar.component';

/**
 * @typedef {{
 *  open: boolean
 *  panel?: string
 *  heading?: string
 *  strapline?: string
 * }} ControlPanelState
 */

/**
 * @typedef {{
 *    type: 'SET_PANEL',
 *    panel: string,
 *    heading?: string,
 *    strapline?: string
 *  } |
 *  {
 *    type: 'CLOSE_PANEL'
 *  }} ControlPanelAction
 */

const defaultState = { open: false };

/**
 *
 * @param {ControlPanelState} state
 * @param {ControlPanelAction} action
 * @returns {ControlPanelState}
 */
export const controlPanelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PANEL': {
      const { panel, heading, strapline } = action;
      return {
        ...state,
        panel,
        heading,
        strapline,
        open: panel === state.panel ? !state.open : true,
      };
    }
    case 'CLOSE_PANEL': {
      return { ...state, open: false };
    }
    default:
      throw new Error('Unhandled action type in controlPanelReducer');
  }
};

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
 *   drawingToolsEnabled: import('drawing-tools/types').DrawingToolsProps['drawingToolsEnabled']
 * }} props
 */
const ControlPanel = ({ sidebarComponents, drawingToolsEnabled }) => {
  const [{ heading, strapline, open, panel }, dispatch] = useReducer(
    controlPanelReducer,
    defaultState,
  );
  const toolbarItems = useToolbarItems({ dispatch });
  const styles = useStyles({});

  return (
    <>
      <Toolbar items={toolbarItems} openItem={open && panel} />
      <SidePanel
        open={open}
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
              onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        }
      >
        {panel === DATA_LAYERS && (
          <DataLayers
            sidebarComponents={sidebarComponents}
            drawingToolsEnabled={drawingToolsEnabled}
          />
        )}
        {panel === SATELLITE_LAYERS && <Satellites />}
        {panel === BOOKMARKS && <BookmarksPanel />}
        {panel === STORIES && <StoriesPanel />}
        {panel === PROFILE && <Profile />}
      </SidePanel>
    </>
  );
};

export default React.memo(ControlPanel);
