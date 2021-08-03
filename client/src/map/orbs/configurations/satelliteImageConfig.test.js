import satelliteImageConfig from './satelliteImageConfig';

describe('satelliteImageConfig', () => {
  const id = 'test-id-123',
    orbState = {
      layers: { [id]: { data: 'test-data', visible: 'test-visible' } },
    };
  let result;

  beforeEach(() => {
    result = satelliteImageConfig({ id, orbState });
  });
  it('Returns a config using data from state', () => {
    expect(result.data).toBe(orbState.layers[id].data);
  });

  it('Returns a config using visible from state', () => {
    expect(result.visible).toBe(orbState.layers[id].visible);
  });
});
