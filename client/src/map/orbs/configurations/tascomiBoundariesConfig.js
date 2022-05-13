import { DataFilterExtension } from '@deck.gl/extensions';

import {
  dataSelector,
  filterValueSelector,
  setClickedFeatures,
} from '../layers.slice';

const LINE_WIDTH_SELECTED = 3;

const COLORS = [
  {
    id: 'Strategic Location',
    pattern: 'hatch-3',
    color: [183, 134, 199, 255],
  },
  {
    id: 'Ward',
    pattern: 'hatch-4',
    color: [235, 185, 126, 255],
  },
  {
    id: 'CIL Charging Zone',
    pattern: 'hatch-1',
    color: [78, 120, 162, 255],
  },
  {
    id: 'NCIL',
    pattern: null,
    color: [247, 22, 36, 255],
  },
  {
    id: 'Highams Park Neighbourhood Plan',
    pattern: 'hatch-2',
    color: [82, 171, 81, 255],
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
  authToken,
  dispatch,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const filterValue = filterValueSelector(id)(orbState);

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
    getFillColor: [0, 0, 0, 0],
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
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
