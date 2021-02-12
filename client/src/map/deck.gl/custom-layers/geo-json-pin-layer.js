import { getGeojsonFeatures } from '@deck.gl/layers/dist/es5/geojson-layer/geojson';
import { PinLayer } from './pin-layer';

export class GeoJsonPinLayer extends PinLayer {
  updateState({ props, oldProps, changeFlags }) {
    const features = getGeojsonFeatures(props.data);
    super.updateState({
      oldProps,
      changeFlags,
      props: { ...props, data: features },
    });
  }
}

GeoJsonPinLayer.layerName = 'GeoJsonPinLayer';
GeoJsonPinLayer.defaultProps = {
  getPosition: { type: 'accessor', value: x => x.geometry.coordinates },
};
