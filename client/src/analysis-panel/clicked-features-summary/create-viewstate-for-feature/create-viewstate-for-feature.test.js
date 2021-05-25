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

const viewState = {
  latitude: 54.71,
  longitude: -4.84,
  pitch: 0,
  bearing: 0,
  zoom: 6,
};

const viewport = {
  width: 1201,
  height: 976,
};

const setViewState = jest.fn();

const props = {
  feature,
  viewState,
  setViewState,
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
      longitude: -78.00000000000072,
      latitude: 38.585216077470605,
      zoom: 6.103610629190256,
    });
  });
});
