import { getGeojsonFeatures } from '@deck.gl/layers/dist/es5/geojson-layer/geojson';
import { ClusteredIconLayer } from './clustered-icon-layer';

export class GeoJsonClusteredIconLayer extends ClusteredIconLayer {
  updateState({ props, ...rest }) {
    const features = getGeojsonFeatures(props.data);
    super.updateState({ ...rest, props: { ...props, data: features } });
  }
}

GeoJsonClusteredIconLayer.layerName = 'GeoJsonClusteredIconLayer';
