import { NotificationManager } from 'react-notifications';
import { selectMapStyle } from 'map/map.actions';

export const FETCH_APP_CONFIG = 'FETCH_APP_CONFIG';
export const NOT_YET_IMPLEMENTED = 'NOT_YET_IMPLEMENTED';

export const fetchAppConfig = () => async dispatch => {
  const response = await fetch('/api/app/config', { credentials: 'include' });

  if (response.ok) {
    const config = await response.json();
    const mapStyles = config.mapStyles;
    dispatch({ type: FETCH_APP_CONFIG, config });
    return dispatch(selectMapStyle(mapStyles[2]));
  } else {
    const error = await response.json();
    const message = `${response.status} ${response.statusText} - ${error.message}`;
    NotificationManager.error(message, 'Fetching App Config Error', 50000, () => {});
  }
};

export const notYetImplemented = text => ({ type: NOT_YET_IMPLEMENTED, text });
