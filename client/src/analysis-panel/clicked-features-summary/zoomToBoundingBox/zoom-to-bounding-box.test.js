import { zoomToBoundingBox } from './zoom-to-bounding-box';

const feature = {
  object: {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [42.442182110182614, -71.73237057390837],
        [42.44864240648848, -71.68619366350798],
        [42.435214377353994, -71.67795391741423],
        [42.4286259901433, -71.70868130388884],
        [42.42495139646385, -71.73082562151579],
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

describe('ZoomToBoundingBox', () => {
  it('returns an updated viewport', () => {
    const result = zoomToBoundingBox(props);

    console.log('result: ', result);

    expect(setViewState).toHaveBeenCalledWith(result);
  });

  it('returns if feature is undefined', () => {
    const result = zoomToBoundingBox({
      ...props,
      feature: undefined,
    });

    expect(result).toBeUndefined();
    expect(setViewState).not.toHaveBeenCalled();
  });

  it('returns if viewState is undefined', () => {
    const result = zoomToBoundingBox({
      ...props,
      viewState: undefined,
    });

    expect(result).toBeUndefined();
    expect(setViewState).not.toHaveBeenCalled();
  });

  it('returns if viewport is undefined', () => {
    const result = zoomToBoundingBox({
      ...props,
      viewport: undefined,
    });

    expect(result).toBeUndefined();
    expect(setViewState).not.toHaveBeenCalled();
  });
});
