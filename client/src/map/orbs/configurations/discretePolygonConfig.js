import { getColorScaleForProperty } from 'utils/color';
import { isRealValue } from 'utils/isRealValue';
import {
  addClickedFeatures,
  clickedFeaturesSelector,
  propertySelector,
  removeClickedFeatures,
  setClickedFeatures,
} from '../slices/isolation-plus.slice';
import {
  COLOR_PRIMARY,
  COLOR_TRANSPARENT,
  LINE_WIDTH,
  LINE_WIDTH_SELECTED,
  OPACITY_FLAT,
  TRANSITION_DURATION,
} from './isolationPlusLayerConfig';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  orbState,
  authToken,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const selectedProperty = propertySelector(orbState);
  const clickedFeatures = clickedFeaturesSelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const colorScale =
    selectedPropertyMetadata &&
    getColorScaleForProperty(selectedPropertyMetadata, 'array');

  const clickedFeatureIds = clickedFeatures?.map(
    f => f.object.properties.index,
  );

  /**
   * @param {AccessorFeature} d
   */
  const isSelected = d => !!clickedFeatureIds?.includes(d.properties.index);

  /**
   * @param {AccessorFeature} d
   * @returns {number}
   */
  const getLineWidth = d => (isSelected(d) ? LINE_WIDTH_SELECTED : LINE_WIDTH);

  /**
   * @param {AccessorFeature} d
   * @returns {[r:number, g:number, b:number, a?: number]}
   */
  const getFillColor = d => {
    if (!isRealValue(d.properties[selectedProperty.name]))
      return COLOR_TRANSPARENT;
    const color = /** @type {[number,number,number]} */ (colorScale &&
      colorScale.get(d.properties[selectedProperty.name]));
    return [...color, OPACITY_FLAT];
  };

  /**
   * @param {import('typings/orbis').PolygonPickedMapFeature} info
   * @param {{srcEvent: PointerEvent}} event
   */
  const onClick = (info, event) => {
    const hasModifier = event.srcEvent.ctrlKey || event.srcEvent.metaKey;
    if (
      !clickedFeatures?.find(
        f => f.object.properties.index === info.object.properties.index,
      )
    ) {
      if (hasModifier) {
        return dispatch(addClickedFeatures([info]));
      }
      return dispatch(setClickedFeatures([info]));
    }

    if (event.srcEvent.ctrlKey || event.srcEvent.metaKey) {
      return dispatch(removeClickedFeatures([info]));
    }

    return dispatch(setClickedFeatures([info]));
  };

  return {
    id,
    data,
    authToken,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    uniqueIdProperty: source?.metadata?.uniqueIdProperty,
    pickable: true,
    autoHighlight: true,
    onClick,
    getLineColor: COLOR_PRIMARY,
    getLineWidth,
    lineWidthUnits: 'pixels',
    getFillColor,
    transitions: {
      getFillColor: TRANSITION_DURATION,
      getLineWidth: TRANSITION_DURATION,
    },
    updateTriggers: {
      getFillColor: [selectedProperty, clickedFeatures],
      getLineWidth: [clickedFeatures],
    },
  };
};

export default configuration;
