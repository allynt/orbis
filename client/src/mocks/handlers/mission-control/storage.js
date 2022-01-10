import { rest } from 'msw';

import {
  getStorage,
  deleteStorage,
} from 'mocks/fixtures/mission-control/storage';

const URL_PATH = '*/api/storage/';

const getFiles = rest.get(URL_PATH, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getStorage()));
});

const deleteFile = rest.delete(`${URL_PATH}:fileId/`, (req, res, ctx) => {
  // console.log('REQUEST: ', req.params.fileId);
  // console.log('CONTEXT: ', ctx);
  // const fileId = null;
  return res(ctx.status(200), ctx.json(deleteStorage(req.params.fileId)));
});

const handlers = [getFiles, deleteFile];

export default handlers;
