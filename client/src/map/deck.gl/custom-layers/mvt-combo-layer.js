import { MVTLayer } from '@deck.gl/geo-layers';
import { getURLFromTemplate } from '@deck.gl/geo-layers/dist/esm/tile-layer/utils';
import { geojsonToBinary, binaryToGeojson } from '@loaders.gl/gis';

export class MVTComboLayer extends MVTLayer {
  static layerName = 'MVTComboLayer';

  async getTileData(tile) {
    const extraDataUrlTemplates = this.props.extraData;
    const uniqueIdProperty = this.props.uniqueIdProperty;

    const extraDataUrls = extraDataUrlTemplates.map(urlTemplate =>
      getURLFromTemplate(urlTemplate, tile),
    );

    // Check that all the templated urls are valid
    if (!extraDataUrls.every(url => url)) {
      return Promise.reject(`Invalid URL Template in extraData[]`);
    }

    // loadOptions taken from
    // https://github.com/visgl/deck.gl/blob/8.8-release/modules/geo-layers/src/mvt-layer/mvt-layer.ts#L191-L206
    let loadOptions = this.getLoadOptions();
    loadOptions = {
      ...loadOptions,
      mimeType: 'application/x-protobuf',
      mvt: {
        ...loadOptions?.mvt,
        coordinates: this.context.viewport.resolution ? 'wgs84' : 'local',
        tileIndex: tile.index,
      },
      gis: this.state.binary ? { format: 'binary' } : {},
    };

    const fetchContext = {
      propName: 'extraData',
      layer: this,
      loadOptions: loadOptions,
      signal: tile.signal,
    };

    const extraDataPromises = extraDataUrls.map(url =>
      this.props.fetch(url, fetchContext),
    );

    // Fetch data and extraData in parallel
    const [data, ...extraLayers] = await Promise.all(
      [super.getTileData(tile)].concat(extraDataPromises),
    );

    // If the MVTLayer decided to fetch in binary format
    // then we need to convert it back to GeoJSON first
    // so that we can work with the individual features in JS.
    const dataGeojson =
      this.state.binary && !Array.isArray(data) ? binaryToGeojson(data) : data;

    const extraLayersGeojson = extraLayers.map(extraLayer =>
      this.state.binary && !Array.isArray(extraLayer)
        ? binaryToGeojson(extraLayer)
        : extraLayer,
    );

    // Build lookup Maps of each set of extra properties
    // featId => properties
    // so that it's easy to lookup properties by featId.
    const extraLayersPropertiesLookup = extraLayersGeojson.map(
      extraLayerFeatures => {
        const propertiesMap = new Map();
        extraLayerFeatures.forEach(feat => {
          // We can only use extraData features that have the uniqueIdProperty
          if (feat.properties?.[uniqueIdProperty]) {
            propertiesMap.set(
              feat.properties[uniqueIdProperty],
              feat.properties,
            );
          }
        });
        return propertiesMap;
      },
    );

    // For a ComboFeature to be valid, it must have data in *every* extraData
    // layer. If we have no extraData for this feature, it must not have been
    // included in the extraData MVT. We cannot be sure we have all properties
    // for this feature, if so, remove it.
    // Also if a feature doesn't have the uniqueIdProperty, we have no way to
    // match it with extra properties.
    const validFeatures = dataGeojson.filter(feature =>
      extraLayersPropertiesLookup.every(
        extraPropertiesMap =>
          feature.properties?.[uniqueIdProperty] &&
          extraPropertiesMap.has(feature.properties[uniqueIdProperty]),
      ),
    );

    // Combine to add all properties
    const combinedFeatures = validFeatures.map(feat => {
      // Add in extra properties from other MVTs
      extraLayersPropertiesLookup.forEach(extraPropertiesLookup => {
        feat.properties = {
          ...feat.properties,

          // We determined above that all valid features have the uniqueIdProperty
          ...extraPropertiesLookup.get(feat.properties?.[uniqueIdProperty]),
        };
      });

      return feat;
    });

    // If we the data was requested to be in binary format
    // we must convert it back to binary.
    return this.state.binary
      ? geojsonToBinary(combinedFeatures)
      : combinedFeatures;
  }
}
