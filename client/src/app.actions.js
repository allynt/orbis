import { NotificationManager } from 'react-notifications';

export const FETCH_APP_CONFIG = 'FETCH_APP_CONFIG';
export const NOT_YET_IMPLEMENTED = 'NOT_YET_IMPLEMENTED';

export const fetchAppConfig = () => async dispatch => {
  const response = await fetch('/api/app/config', { credentials: 'include' });
  const config = await response.json();

  if (response.ok) {
    return dispatch({ type: FETCH_APP_CONFIG, config });
  } else {
    const message = `${response.status} ${response.statusText} - ${config.message}`;

    NotificationManager.error(message, 'Fetching App Config', 50000, () => {});
  }
};

export const notYetImplemented = text => ({ type: NOT_YET_IMPLEMENTED, text });
