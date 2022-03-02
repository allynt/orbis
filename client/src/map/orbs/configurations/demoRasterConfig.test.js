import configFn from './demoRasterConfig';

const setup = ({ orbState = undefined } = {}) =>
  configFn({
    id: 'test/layer',
    activeSources: [
      {
        source_id: 'test/layer',
        metadata: {
          properties: [
            { name: 'defaultValue', bounds: 123 },
            { name: 'otherValue', bounds: 456 },
          ],
        },
      },
    ],
    orbState: {
      ...orbState,
      layers: {
        ...orbState?.layers,
        'test/layer': {
          ...orbState?.layers?.['test/layer'],
          data: 'data/url',
        },
      },
    },
    defaultValue: 'defaultValue',
    otherStateKey: 'test/layer',
    valueKey: 'value',
    defaultDate: '123',
    authTokens: {
      'test/layer': 'testAuthToken',
      'test/layer2': 'testAuthToken2',
    },
  });

describe('demoRasterConfig', () => {
  describe('image', () => {
    it('Uses defaultValue if other is not present', () => {
      const result = setup();
      expect(result.image).toStrictEqual(
        expect.stringContaining('data/url/defaultValue'),
      );
      expect(result.loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });

    it('Uses defaultValue if other[valueKey] is not present', () => {
      const result = setup();
      expect(result.image).toStrictEqual(
        expect.stringContaining('data/url/defaultValue'),
      );
      expect(result.loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });

    it('Uses the value of other[valueKey]', () => {
      const result = setup({
        orbState: { layers: { 'test/layer': { other: { value: 'test' } } } },
      });
      expect(result.image).toStrictEqual(
        expect.stringContaining('data/url/test'),
      );
      expect(result.loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });

    it('Uses defaultDate if other is not present', () => {
      const { image, loadOptions } = setup();
      expect(image).toStrictEqual(expect.stringContaining('123'));
      expect(loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });

    it('Uses defaultDate if other.date is not present', () => {
      const { image, loadOptions } = setup({
        orbState: { layers: { 'test/layer': { other: {} } } },
      });
      expect(image).toStrictEqual(expect.stringContaining('123'));
      expect(loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });

    it('Uses other.date', () => {
      const { image, loadOptions } = setup({
        orbState: {
          layers: { 'test/layer': { other: { date: 1577836800000 } } },
        },
      });
      expect(image).toStrictEqual(expect.stringContaining('20200101'));
      expect(loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });
  });

  describe('bounds', () => {
    it('Uses the bounds of defaultValue', () => {
      const { bounds } = setup();
      expect(bounds).toBe(123);
    });

    it('Uses the bounds of other[valueKey]', () => {
      const { bounds, loadOptions } = setup({
        orbState: {
          layers: { 'test/layer': { other: { value: 'otherValue' } } },
        },
      });
      expect(bounds).toBe(456);
      expect(loadOptions.fetch.headers.Authorization).toEqual(
        'Bearer testAuthToken',
      );
    });
  });
});
