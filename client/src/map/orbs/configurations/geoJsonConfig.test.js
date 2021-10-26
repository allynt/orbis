import geoJsonLayer from './geoJsonConfig.js';

describe('geoJsonLayer', () => {
  const id = 'test-id',
    orbState = {
      layers: { [id]: { data: 'test-data', visible: 'test-visible' } },
    };
  let result;

  beforeEach(() => {
    result = geoJsonLayer({ id, orbState });
  });
  it('Returns a config using data from state', () => {
    expect(result.data).toBe(orbState.layers[id].data);
  });

  it('Returns a config using visible from state', () => {
    expect(result.visible).toBe(orbState.layers[id].visible);
  });
});
