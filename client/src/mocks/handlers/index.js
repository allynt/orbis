import appHandlers from './app';
import authHandlers from './auth';
import bookmarkHandlers from './bookmarks';
import documentHandlers from './mission-control/documents';
import storageHandlers from './mission-control/storage';
import orbHandlers from './orbs';
import satelliteHandlers from './satellites';

const handlers = [
  ...appHandlers,
  ...authHandlers,
  ...bookmarkHandlers,
  ...orbHandlers,
  ...satelliteHandlers,
  ...storageHandlers,
  ...documentHandlers,
];

export default handlers;
