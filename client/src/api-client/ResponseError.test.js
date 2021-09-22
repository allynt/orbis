import { ResponseError } from './ResponseError';

describe('ResponseError', () => {
  it('has a message', () => {
    const error = new ResponseError({ statusText: 'test message' });
    expect(error.message).toBe('test message');
  });

  it('has a status', () => {
    const error = new ResponseError({ status: 418 });
    expect(error.status).toBe(418);
  });

  describe('getErrors', () => {
    it('returns undefined if errors is undefined', () => {
      const errors = {};
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(response);
      expect(error.getErrors()).resolves.toBeUndefined();
    });

    it("returns undefined if it's a detail error", () => {
      const errors = { detail: 'something' };
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(response);
      expect(error.getErrors()).resolves.toBeUndefined();
    });

    it('Returns a flat list of errors from the response if it contains an error object', async () => {
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
      const error = new ResponseError(response);
      const responseErrors = await error.getErrors();
      expect(responseErrors).toEqual(expected);
    });

    it('Returns a flat list of errors from the response if it contains a non_field_error object', async () => {
      const non_field_errors = ['non-field-error-1', 'non-field-error-2'];
      const errors = {
        non_field_errors,
      };
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(response);
      const responseErrors = await error.getErrors();
      expect(responseErrors).toEqual(non_field_errors);
    });

    it('Returns a flat list of errors from the response if it contains an error object and non_field_error object', async () => {
      const non_field_errors = ['non-field-error-1', 'non-field-error-2'];
      const errors = {
        errors: {
          field1: ['field1/error1', 'field1/error2'],
          field2: ['field2/error1', 'field2/error2'],
        },
        non_field_errors,
      };
      const expected = [
        'non-field-error-1',
        'non-field-error-2',
        'field1/error1',
        'field1/error2',
        'field2/error1',
        'field2/error2',
      ];
      const response = { json: () => new Promise(resolve => resolve(errors)) };
      const error = new ResponseError(response);
      const responseErrors = await error.getErrors();
      expect(responseErrors).toEqual(expected);
    });
  });

  describe('getBody', () => {
    it('only calls response.json() once', async () => {
      const body = {
        errors: { test: ['error1'] },
        otherStuff: { things: 'mazing' },
      };
      const json = jest.fn(() => new Promise(resolve => resolve(body)));
      const response = { json };
      const error = new ResponseError(response);
      await error.getBody();
      await error.getErrors();
      expect(json).toHaveBeenCalledTimes(1);
    });
  });
});
