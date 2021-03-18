import { format } from 'date-fns';
import { find, get } from 'lodash';
import { ColorScale } from 'utils/ColorScale';
import { otherSelector } from '../orbReducer';

const DEFAULT_COLUMN = 'rgb',
  DEFAULT_DATE = 1583971200000;

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, data, orbState, activeSources }) => {
  const source = find(activeSources, { source_id: id });
  const other = otherSelector(`${source.authority}/${source.namespace}/*/*`)(
    orbState,
  );
  const column = get(other, 'column', DEFAULT_COLUMN),
    date = get(other, 'date', DEFAULT_DATE);
  const property = find(source.metadata.properties, { name: column });
  const colorScale = new ColorScale({
    color: property?.application.orbis.display.color,
    domain: [property?.min, property?.max],
    format: 'array',
  });

  /** @param {{properties: any}} feature */
  const getFillColor = feature => {
    return property
      ? colorScale?.get(
          find(feature?.properties[property?.name], tv => {
            return tv.timestamp.includes(format(new Date(date), 'yyyy-MM-dd'));
          })?.value,
        )
      : [255, 255, 255, 255];
  };

  return {
    id,
    data,
    getFillColor,
    updateTriggers: {
      getFillColor: [column, date],
    },
  };
};
