import { TileLayer } from 'deck.gl';
import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import { LAYER_IDS } from '../../../map.constants';
import { gunzipSync } from 'zlib';

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const layers = [
    new TileLayer({
      id: LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      data: data[LAYER_IDS.astrosat.isolationPlus.ahah.v0],
      getTileData: tile =>
        fetch(tile.url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/x-protobuf',
          },
        })
          .then(res => {
            if (res.status === 200) return res.arrayBuffer();
            return null;
          })
          .then(buffer => {
            if (buffer) {
              const unzipped = gunzipSync(new Buffer(buffer));
              const tile = new VectorTile(new Protobuf(unzipped));
              const features = [];
              for (const layerName in tile.layers) {
                const vectorTileLayer = tile.layers[layerName];
                for (let i = 0; i < vectorTileLayer.length; i += 1) {
                  const vectorTileFeature = vectorTileLayer.feature(i);
                  const feature = vectorTileFeature.toGeoJSON(
                    tile.x,
                    tile.y,
                    tile.z,
                  );
                  features.push(feature);
                }
              }
              return features;
            }
            return [];
          }),
      uniqueIdProperty: sources.find(
        source => source.source_id === LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      )?.metadata.uniqueIdProperty,
      getFillColor: [140, 170, 180, 255],
    }),
  ];

  return { layers, mapComponents: [], sidebarComponents: {} };
};

useIsolationPlusOrb.id = 'test';

/*

          

*/
