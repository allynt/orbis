import React, { useReducer } from 'react';

import {
  CloseIcon,
  IconButton,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback, LoadingTextFallback } from 'components';
import { SidePanel } from 'components/side-panel/side-panel.component';

import { useToolbarItems } from './toolbar-config';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';
import Toolbar from './toolbar.component';

const Profile = React.lazy(() =>
  import(
    /* webpackChunkName: "Profile" */ 'accounts/profile/profile.component'
  ),
);
const BookmarksPanel = React.lazy(() =>
  import(
    /* webpackChunkName: "Bookmarks" */ 'bookmarks/bookmarks-panel.component'
  ),
);
const DataLayers = React.lazy(() =>
  import(
    /* webpackChunkName: "DataLayers" */ 'data-layers/data-layers.component'
  ),
);
const Satellites = React.lazy(() =>
  import(
    /* webpackChunkName: "Satellites" */ 'satellites/satellites.component'
  ),
);
const StoriesPanel = React.lazy(() =>
  import(/* webpackChunkName: "Stories" */ 'stories/stories-panel.component'),
);

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
const ControlPanel = ({
  sidebarComponents,
  drawingToolsEnabled,
  aoiDrawMode,
  setAoiDrawMode,
}) => {
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
        <React.Suspense
          fallback={
            <LoadingTextFallback>Loading {heading}...</LoadingTextFallback>
          }
        >
          <ErrorBoundary
            fallbackRender={props => <ErrorFallback messageOnly {...props} />}
          >
            {panel === DATA_LAYERS && (
              <DataLayers
                sidebarComponents={sidebarComponents}
                drawingToolsEnabled={drawingToolsEnabled}
                aoiDrawMode={aoiDrawMode}
                setAoiDrawMode={setAoiDrawMode}
              />
            )}
            {panel === SATELLITE_LAYERS && <Satellites />}
            {panel === BOOKMARKS && <BookmarksPanel />}
            {panel === STORIES && <StoriesPanel />}
            {panel === PROFILE && <Profile />}
          </ErrorBoundary>
        </React.Suspense>
      </SidePanel>
    </>
  );
};

export default React.memo(ControlPanel);
