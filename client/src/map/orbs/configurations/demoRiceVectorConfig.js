import { format } from 'date-fns';
import { find, get } from 'lodash';

import { ColorScale } from 'utils/ColorScale';

import {
  extrudedModeSelector,
  extrusionScaleSelector,
  visibilitySelector,
  dataSelector,
  otherSelector,
  setClickedFeatures,
} from '../layers.slice';

const DEFAULT_COLUMN = 'rgb',
  DEFAULT_DATE = 1583971200000;

/** @type {import("typings/orbis").LayerConfiguration} */
const Config = ({ id, orbState, activeSources, dispatch }) => {
  const extruded = extrudedModeSelector(orbState);
  const elevationScale = extrusionScaleSelector(orbState);
  const visible = visibilitySelector(id)(orbState);
  const data = dataSelector(id)(orbState);
  const source = find(activeSources, { source_id: id });
  const other = otherSelector(`${source.authority}/${source.namespace}/rice/*`)(
    orbState,
  );
  const column = get(other, 'column', DEFAULT_COLUMN),
    date = get(other, 'date', DEFAULT_DATE);
  /** @type {import("typings/orbis").ContinuousProperty} */
  const property = find(source.metadata.properties, { name: column });
  const colorScale = new ColorScale({
    color: property?.application.orbis.display.color,
    domain: [property?.min, property?.max],
    format: 'array',
  });

  /** @param {{properties: any}} feature */
  const getFillColor = feature =>
    property
      ? colorScale?.get(
          find(feature?.properties[property?.name], tv => {
            return tv.timestamp.includes(format(new Date(date), 'yyyy-MM-dd'));
          })?.value,
        )
      : [255, 255, 255, 0];

  const getElevation = feature =>
    property
      ? find(feature?.properties[property?.name], tv => {
          return tv.timestamp.includes(format(new Date(date), 'yyyy-MM-dd'));
        })?.value
      : 1;

  return {
    id,
    visible: visible && !!source,
    data,
    pickable: true,
    autoHighlight: true,
    onClick: f =>
      dispatch(setClickedFeatures({ key: id, clickedFeatures: [f.object] })),
    extruded,
    elevationScale: 100 * elevationScale,
    getElevation,
    getFillColor,
    stroked: true,
    lineWidthUnits: 'pixels',
    getLineWidth: 2,
    getLineColor: [255, 255, 255, 255],
    updateTriggers: {
      getElevation: [column, date],
      getFillColor: [column, date],
    },
    transitions: {
      getElevation: 150,
      getFillColor: 150,
    },
  };
};

export default Config;
