import { rest } from 'msw';

import { orbs } from 'mocks/fixtures/orbs';

const URL_PATH = '*/api/orbs/';

const getOrbs = rest.get(URL_PATH, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(orbs));
});

const handlers = [getOrbs];

export default handlers;
