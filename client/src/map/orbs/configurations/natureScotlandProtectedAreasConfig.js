import { DataFilterExtension, FillStyleExtension } from '@deck.gl/extensions';

import { getAuthTokenForSource } from 'utils/tokens';

import {
  dataSelector,
  filterValueSelector,
  setClickedFeatures,
} from '../layers.slice';

const LINE_WIDTH_SELECTED = 3;

const COLORS = [
  {
    id: 'SSSI',
    pattern: 'hatch-3',
    color: [255, 44, 44, 255],
  },
  {
    id: 'SPA',
    pattern: 'hatch-4',
    color: [224, 120, 255, 255],
  },
  {
    id: 'SAC',
    pattern: 'hatch-1',
    color: [22, 105, 232, 255],
  },
  {
    id: 'RAMSAR',
    pattern: 'hatch-2',
    color: [255, 215, 138, 255],
  },
  {
    id: 'GCR',
    pattern: null,
    color: [221, 254, 245, 100],
  },
];

/**
 * Configuration of the Nature Scotland - Protected Areas dataset.
 *
 * @param {object} {
 *   id,
 *   activeSources,
 *   orbState,
 *   authToken,
 *   dispatch,
 * }
 * @return {object} The configuration object for the MVTLayer used to represent
 *                  this data.
 */
const configuration = ({
  id,
  activeSources,
  orbState,
  authTokens,
  dispatch,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const filterValue = filterValueSelector(id)(orbState);
  const authToken = getAuthTokenForSource(authTokens, source);

  /**
   * What to do when a feature is clicked.
   *
   * @param {object} feature - feature to check.
   *
   * @returns Nothing
   */
  const onClick = feature =>
    dispatch(
      setClickedFeatures({
        key: source?.source_id,
        clickedFeatures: [
          { ...feature.object, geometry: { coordinates: feature.coordinate } },
        ],
      }),
    );

  /**
   * Set the line color to be used for each feature.
   *
   * @param {object} feature - feature to check.
   *
   * @returns {number[]} The RGBA color to use for the specific feature.
   */
  const getLineColor = feature =>
    COLORS.find(color => color.id === feature.properties.Type).color || [
      246, 190, 0, 255,
    ];

  /**
   * Set the fill color to be used for each feature.
   *
   * @param {object} feature - feature to check.
   *
   * @returns {number[]} The RGBA color to use for the specific feature.
   */
  const getFillColor = feature =>
    COLORS.find(color => color.id === feature.properties.Type).color || [
      255, 0, 0, 255,
    ];

  /**
   * Set the fill pattern to be used for each feature.
   *
   * @param {object} feature - feature to check.
   *
   * @returns {string} The pattern to use for the specific feature.
   */
  const getFillPattern = feature =>
    COLORS.find(color => color.id === feature.properties.Type).pattern;

  /**
   * Check if feature should be displayed or not.
   * It returns the number one, if the feature should be displayed, zero
   * otherwise. The `filterRange` in the object is set to `[1, 1]`, meaning
   * one with be displayed, zero will not.
   *
   * @param {object} feature - feature to check.
   *
   * @returns {number} One if to be displayed, zero otherwise.
   */
  const getFilterValue = feature =>
    filterValue?.includes(feature.properties.Type) ? 1 : 0;

  // Configuration object for the MVTLayer, used for Protected Areas data.
  return {
    id,
    data,
    visible: true,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    pickable: true,
    onClick,
    getLineColor,
    getLineWidth: LINE_WIDTH_SELECTED,
    getFilterValue,
    filterRange: [1, 1],
    lineWidthUnits: 'pixels',
    getFillColor,
    autoHighlight: false,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
    updateTriggers: {
      getFilterValue, // Re-calculate visible features, when checkboxes checked.
    },
    // FileStyleExtension props
    fillPatternMask: true,
    fillPatternAtlas: './natureScotland.png',
    fillPatternMapping: './natureScotland.json',
    getFillPattern,
    getFillPatternScale: 64,
    getFillPatternOffset: [0, 0],
    extensions: [
      new DataFilterExtension({ filterSize: 1 }),
      new FillStyleExtension({ pattern: true }),
    ],
  };
};

export default configuration;
