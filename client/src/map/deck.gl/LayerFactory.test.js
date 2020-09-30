import { GeoJsonLayer } from 'deck.gl';
import { LayerFactory } from './LayerFactory';

describe.only('LayerFactory', () => {
  it('returns a new layer instance based on the layer name in the source', () => {
    const result = LayerFactory({
      // @ts-ignore
      metadata: {
        application: { orbis: { layer: { name: 'GeoJsonLayer' } } },
      },
    });
    expect(result).toBeInstanceOf(GeoJsonLayer);
  });
});
