import { WebMercatorViewport } from '@deck.gl/core';

import { tileCoordinatesToLatLon } from './tileCoordinatesToLatLon';

const bbox = { west: -180, north: 85.0511287798066, east: 0, south: 0 };

describe('tileCoordinatesToLatLon', () => {
  it.each([
    [
      'Point',
      {
        result: { type: 'Point', coordinates: [-135, 79.17133464081945] },
        geometry: {
          type: 'Point',
          coordinates: [0.25, 0.25],
        },
      },
    ],
    [
      'MultiPoint',
      {
        result: {
          type: 'MultiPoint',
          coordinates: [
            [-135, 79.17133464081945],
            [-90, 66.51326044311185],
          ],
        },
        geometry: {
          type: 'MultiPoint',
          coordinates: [
            [0.25, 0.25],
            [0.5, 0.5],
          ],
        },
      },
    ],
    [
      'Polygon',
      {
        result: {
          type: 'Polygon',
          coordinates: [
            [
              [-180, 0],
              [0, 0],
              [0, 66.51326044311185],
              [-180, 0],
            ],
          ],
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 1],
              [1, 1],
              [1, 0.5],
              [0, 1],
            ],
          ],
        },
      },
    ],
    [
      'MultiPolygon',
      {
        result: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [-180, 0],
                [0, 0],
                [0, 66.51326044311185],
                [-180, 0],
              ],
              [
                [-180, 0],
                [0, -66.51326044311185],
                [0, -40.97989806962013],
                [-180, 0],
              ],
            ],
          ],
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 1],
                [1, 1],
                [1, 0.5],
                [0, 1],
              ],
              [
                [0, 1],
                [1, 1.5],
                [1, 1.25],
                [0, 1],
              ],
            ],
          ],
        },
      },
    ],
    [
      'LineString',
      {
        result: {
          type: 'LineString',
          coordinates: [
            [-180, 85.0511287798066],
            [-180, 0],
          ],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [0, 1],
          ],
        },
      },
    ],
    [
      'MultiLineString',
      {
        result: {
          type: 'MultiLineString',
          coordinates: [
            [
              [-180, 85.0511287798066],
              [-180, 0],
            ],
            [
              [-90, 66.51326044311185],
              [-180, 0],
            ],
          ],
        },
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [0, 0],
              [0, 1],
            ],
            [
              [0.5, 0.5],
              [0, 1],
            ],
          ],
        },
      },
    ],
  ])(
    'converts tile coordinates to lat/lon for %s geometry',
    (_, { geometry, result }) => {
      const viewport = new WebMercatorViewport({
        latitude: 0,
        longitude: 0,
        zoom: 1,
      });

      const fnResult = tileCoordinatesToLatLon(geometry, bbox, viewport);

      expect(fnResult).toEqual(result);
    },
  );
});
