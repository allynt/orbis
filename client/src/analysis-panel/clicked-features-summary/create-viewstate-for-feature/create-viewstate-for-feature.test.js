import { zoomToFeature } from './create-viewstate-for-feature';

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

describe('zoomToFeature', () => {
  it('returns if feature is undefined', () => {
    zoomToFeature({
      ...props,
      feature: undefined,
    });

    expect(setViewState).not.toHaveBeenCalled();
  });

  it('returns if viewState is undefined', () => {
    zoomToFeature({
      ...props,
      viewState: undefined,
    });

    expect(setViewState).not.toHaveBeenCalled();
  });

  it('returns if viewport is undefined', () => {
    zoomToFeature({
      ...props,
      viewport: undefined,
    });

    expect(setViewState).not.toHaveBeenCalled();
  });

  it('returns an updated viewport', () => {
    zoomToFeature(props);

    expect(setViewState).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: 38.585216077470605,
        latitude: 38.585216077470605,
        zoom: 6.103610629190256,
      }),
    );
  });
});
