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

  describe('getErrors', () => {
    it('returns undefined if errors is undefined', () => {
      const errors = {};
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(null, null, response);
      expect(error.getErrors()).resolves.toBeUndefined();
    });

    it("returns undefined if it's a detail error", () => {
      const errors = { detail: 'something' };
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(null, null, response);
      expect(error.getErrors()).resolves.toBeUndefined();
    });

    it('Returns a flat list of errors from the response if it contains an error object', () => {
      const errors = {
        errors: {
          field1: ['field1/error1', 'field1/error2'],
          field2: ['field2/error1', 'field2/error2'],
        },
      };
      const expected = [
        'field1/error1',
        'field1/error2',
        'field2/error1',
        'field2/error2',
      ];
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(null, null, response);
      expect(error.getErrors()).resolves.toEqual(expected);
    });
  });
});
