import { createViewstateForSuggestion, zoomToArea } from './aoi-utils';

describe('AOI Utils', () => {
  let viewport = null;

  beforeEach(() => {
    viewport = { width: 1505, height: 669 };
  });

  describe('Create Viewstate', () => {
    it('should return viewstate details for postcode', () => {
      const suggestion = {
        type: 'postcode',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.166510570319359, 55.96220397687685],
              [-3.166287347389438, 55.96225190245889],
              [-3.16574345006637, 55.96168088892483],
              [-3.167014390313933, 55.9616272677491],
              [-3.16706464753815, 55.96153301071892],
              [-3.167092561989605, 55.96139854243141],
              [-3.167277858652246, 55.96128432183574],
              [-3.1673732522354, 55.96134252532256],
              [-3.16759823454886, 55.961598830473015],
              [-3.167787931112195, 55.96181486711733],
              [-3.167716446396103, 55.961835756007616],
              [-3.167546245152163, 55.96188551695281],
              [-3.167196154227776, 55.96198791458946],
              [-3.166900393131301, 55.962074346213385],
              [-3.166549382602735, 55.96217702018641],
              [-3.166510570319359, 55.96220397687685],
            ],
          ],
        },
      };

      const result = createViewstateForSuggestion({
        suggestion,
        viewport,
      });

      const expected = {
        longitude: -3.166766,
        latitude: 55.961768,
        zoom: 17.820313,
      };

      expect(result).toEqual(expected);
    });

    it('should return viewstate details for Protected Area', () => {
      const suggestion = {
        type: 'protected-area',
        bbox: [-3.2029559, 55.939557, -3.1484718, 55.9567475],
      };

      const result = createViewstateForSuggestion({
        suggestion,
        viewport,
      });

      const expected = {
        longitude: -3.175714,
        latitude: 55.948153,
        zoom: 13.669734,
      };

      expect(result).toEqual(expected);
    });

    it('should return viewstate details for Place', () => {
      const suggestion = {
        type: 'place',
        center: [-3.199084, 57.61328],
      };

      const result = createViewstateForSuggestion({
        suggestion,
        viewport,
      });

      const expected = {
        longitude: -3.199084,
        latitude: 57.613391,
        zoom: 10.218467,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('Zoom to Area', () => {
    let viewState = null;
    let setViewState = null;

    beforeEach(() => {
      viewState = {
        latitude: 54.71,
        longitude: -4.84,
        zoom: 6,
      };
      setViewState = jest.fn();
    });

    it('should zoom to an area', () => {
      const suggestion = {
        type: 'place',
        center: [-3.199084, 57.61328],
      };

      zoomToArea(viewport, viewState, setViewState, suggestion);

      expect(setViewState).toHaveBeenCalledWith(
        expect.objectContaining({
          latitude: 57.613391,
          longitude: -3.199084,
        }),
      );
    });
  });
});
