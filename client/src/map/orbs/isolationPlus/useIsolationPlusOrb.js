import { TileLayer } from 'deck.gl';
import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import { LAYER_IDS } from '../../../map.constants';
import { gunzipSync } from 'zlib';
import { interpolateBlues } from 'd3-scale-chromatic';

const rgbStringToArray = string => {
  const values = string.match(/(\d)+/g);
  return values.map(str => +str);
};

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const layers = [
    new TileLayer({
      id: LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      data: data[LAYER_IDS.astrosat.isolationPlus.ahah.v0],
      visible: true,
      getTileData: tile =>
        fetch(tile.url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
          .then(res => {
            if (res.status === 200) return res.arrayBuffer();
            return null;
          })
          .then(buffer => {
            if (buffer) {
              const unzipped = gunzipSync(Buffer.from(buffer));
              const vectorTile = new VectorTile(new Protobuf(unzipped));
              const features = [];
              for (const layerName in vectorTile.layers) {
                const vectorTileLayer = vectorTile.layers[layerName];
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
      filled: true,
      getFillColor: d => {
        return [
          ...rgbStringToArray(
            interpolateBlues(d.properties['IMD: Income decile'] / 10),
          ),
          175,
        ];
      },
      pickable: true,
      autoHighlight: true,
    }),
  ];

  return { layers, mapComponents: [], sidebarComponents: {} };
};

useIsolationPlusOrb.id = 'test';

/*

          

*/
