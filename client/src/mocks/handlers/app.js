import { rest } from 'msw';

import { config } from 'mocks/fixtures/app';

const getAppConfig = rest.get('*/api/app/config', (req, res, ctx) =>
  res(ctx.status(200), ctx.json(config)),
);

const handlers = [getAppConfig];

export default handlers;
