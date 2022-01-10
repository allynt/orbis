import { rest } from 'msw';

import { getDocuments } from 'mocks/fixtures/mission-control/documents';

const URL_PATH = '*/api/documents/agreements/';

const getAgreedDocuments = rest.get(URL_PATH, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getDocuments()));
});

const handlers = [getAgreedDocuments];

export default handlers;
