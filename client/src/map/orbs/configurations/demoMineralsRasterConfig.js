import { find } from 'lodash';
import {
  visibilitySelector,
  otherSelector,
  dataSelector,
} from '../layers.slice';

/**
 * @type {import('typings/orbis').LayerConfiguration<{
 *  otherStateKey: string
 *  valueKey: string
 *  defaultValue: string
 *  dateFormat: string
 *  defaultDate: string
 * }>}
 */
export default ({
  id,
  activeSources,
  authToken,
  orbState,
  otherStateKey,
  valueKey,
  defaultValue,
}) => {
  const source = find(activeSources, { source_id: id });
  const visible = visibilitySelector(id)(orbState);
  const other = otherSelector(otherStateKey)(orbState);
  const data = dataSelector(id)(orbState);

  return {
    id,
    visible: visible && !!source,
    image: `${data}/${
      other?.[valueKey] ? other[valueKey] : defaultValue
    }_aoi_acq20201030_proc20210514.png`,
    bounds: find(source.metadata.properties, {
      name: other?.[valueKey] || defaultValue,
    })?.bounds,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};
