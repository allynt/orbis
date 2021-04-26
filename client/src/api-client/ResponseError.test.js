import { ResponseError } from './ResponseError';

describe('ResponseError', () => {
  it('has a message', () => {
    const error = new ResponseError('test message', null);
    expect(error.message).toBe('test message');
  });

  it('has a status', () => {
    const error = new ResponseError(null, 418);
    expect(error.status).toBe(418);
  });
});
