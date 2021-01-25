import { renderHook } from '@testing-library/react-hooks';
import { useMap } from 'MapContext';

describe('MapContext', () => {
  it('Throws an error if not wrapped with a Provider', () => {
    const { result } = renderHook(() => useMap());
    expect(result.error).toEqual(Error('Wrap your app with <MapProvider />'));
  });
});
