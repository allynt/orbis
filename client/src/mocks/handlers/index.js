import appHandlers from './app';
import authHandlers from './auth';
import bookmarkHandlers from './bookmarks';
import orbHandlers from './orbs';
import satelliteHandlers from './satellites';
import storageHandlers from './mission-control/storage';
import documentHandlers from './mission-control/documents';

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
