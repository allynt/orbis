import { rest } from 'msw';

import { server } from 'mocks/server';

import { ProposalsClient } from './ProposalsClient';

describe('ProposalsClient', () => {
  let client;

  beforeEach(() => {
    client = new ProposalsClient();
  });

  it('should return Proposals from the response', async () => {
    const proposals = [{ id: 1 }, { id: 2 }];

    server.use(
      rest.get('*/api/proposals/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(proposals));
      }),
    );

    const client = new ProposalsClient();
    const responseProposals = await client.getProposals();

    expect(responseProposals).toEqual(proposals);
  });

  it('should return the response from the Add Proposal request', async () => {
    const newProposal = {
      name: 'Test Name',
      description: 'Test description',
      geometry: JSON.stringify({
        type: 'Polygon',
        geometry: {
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        },
      }),
    };
    const responseProposal = { ...newProposal, id: 123 };

    server.use(
      rest.post('*/api/proposals/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(responseProposal));
      }),
    );

    const proposal = await client.saveProposal(newProposal);

    expect(proposal).toEqual(responseProposal);
  });

  it('should update the Proposal', async () => {
    const updatedProposal = {
      id: 1,
      name: 'Test Name Updated',
      description: 'Test description',
      geometry: JSON.stringify({
        type: 'Polygon',
        geometry: {
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [2, 2],
            [0, 0],
          ],
        },
      }),
    };

    server.use(
      rest.put('*/api/proposals/:id/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(updatedProposal));
      }),
    );

    const client = new ProposalsClient();
    const response = await client.updateProposal(updatedProposal);

    expect(response).toEqual(updatedProposal);
  });

  it('should delete the Proposal', async () => {
    server.use(
      rest.delete('*/api/proposals/:id/', (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    );

    const client = new ProposalsClient();
    const response = await client.deleteProposal(1);

    expect(response.ok).toBe(true);
  });
});
