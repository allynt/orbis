import { NotificationManager } from 'react-notifications';
import { selectMapStyle } from 'map/map.actions';

export const FETCH_APP_CONFIG_SUCCESS = 'FETCH_APP_CONFIG_SUCCESS';
export const FETCH_APP_CONFIG_FAILURE = 'FETCH_APP_CONFIG_FAILURE';

export const NOT_YET_IMPLEMENTED = 'NOT_YET_IMPLEMENTED';

export const DEFAULT_MAP_STYLE = 3;

export const fetchAppConfig = () => async dispatch => {
  const response = await fetch('/api/app/config', { credentials: 'include' });

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching App Config Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_APP_CONFIG_FAILURE,
      error: { message }
    });
  }

  const config = await response.json();
  dispatch({ type: FETCH_APP_CONFIG_SUCCESS, config });

  const mapStyles = config.mapStyles;
  return dispatch(selectMapStyle(mapStyles[DEFAULT_MAP_STYLE]));
};

export const notYetImplemented = text => ({ type: NOT_YET_IMPLEMENTED, text });
