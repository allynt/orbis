import { GeoJsonLayer } from 'deck.gl';
import { LayerFactory } from './LayerFactory';

describe.only('LayerFactory', () => {
  it('returns a new layer instance based on the provided layer name', () => {
    const result = LayerFactory('GeoJsonLayer');
    expect(result).toBeInstanceOf(GeoJsonLayer);
  });
});
