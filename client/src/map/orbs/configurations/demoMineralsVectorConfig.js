import { DataFilterExtension } from '@deck.gl/extensions';
import { find, get } from 'lodash';

import { ColorScale } from 'utils/ColorScale';

import {
  dataSelector,
  filterValueSelector,
  visibilitySelector,
} from '../layers.slice';

/** @type {import("typings/orbis").LayerConfiguration} */
const Config = ({ id, orbState, activeSources }) => {
  const visible = visibilitySelector(id)(orbState);
  const data = dataSelector(id)(orbState);
  const filterValue = filterValueSelector(id)(orbState);
  const source = find(activeSources, { source_id: id });
  const property = find(source.metadata.properties, { name: 'Class_name' });
  const colorScale = new ColorScale({
    color: property.application.orbis.display.color,
    domain: Object.keys(property.categories),
    format: 'array',
  });

  /** @param {{properties: any}} feature */
  const getFillColor = feature =>
    colorScale.get(get(feature.properties, 'Class_name'));

  return {
    id,
    visible: visible && !!source,
    data,
    getFillColor,
    getFilterValue: feature =>
      filterValue
        ? Number(!filterValue?.includes(feature.properties.Class_name))
        : 1,
    filterRange: [1, 1],
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    updateTriggers: {
      getFilterValue: [filterValue],
    },
  };
};

export default Config;
