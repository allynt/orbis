import { createViewstateForFeature } from './create-viewstate-for-feature';

const feature = {
  object: {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74, 40],
          [-78, 42],
          [-82, 35],
        ],
      ],
    },
  },
};

const viewport = {
  width: 1201,
  height: 976,
};

const props = {
  feature,
  viewport,
};

describe('createViewstateForFeature', () => {
  it('returns if feature is undefined', () => {
    const result = createViewstateForFeature({
      ...props,
      feature: undefined,
    });

    expect(result).toBeUndefined();
  });

  it('returns if viewport is undefined', () => {
    const result = createViewstateForFeature({
      ...props,
      viewport: undefined,
    });

    expect(result).toBeUndefined();
  });

  it('returns an updated viewport', () => {
    const result = createViewstateForFeature(props);

    expect(result).toEqual({
      longitude: -78.0,
      latitude: 38.585216,
      zoom: 6.103611,
    });
  });
});
