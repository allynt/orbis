import { GeoJsonLayer } from '@deck.gl/layers';
import { LayerFactory } from './LayerFactory';

describe('LayerFactory', () => {
  it('returns a new layer instance based on the provided layer name', () => {
    const result = LayerFactory('GeoJsonLayer');
    expect(result).toBeInstanceOf(GeoJsonLayer);
  });
});
