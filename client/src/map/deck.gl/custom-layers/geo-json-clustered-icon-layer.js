import { getGeojsonFeatures } from '@deck.gl/layers/dist/es5/geojson-layer/geojson';

import { ClusteredIconLayer } from './clustered-icon-layer';

export class GeoJsonClusteredIconLayer extends ClusteredIconLayer {
  updateState({ props, oldProps, changeFlags }) {
    const features = getGeojsonFeatures(props.data);
    super.updateState({
      oldProps,
      changeFlags,
      props: { ...props, data: features },
    });
  }
}

GeoJsonClusteredIconLayer.layerName = 'GeoJsonClusteredIconLayer';
GeoJsonClusteredIconLayer.defaultProps = {
  getPosition: { type: 'accessor', value: x => x.geometry.coordinates },
};
