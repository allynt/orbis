import { createColorScale } from './color';

const WHITE = 'rgb(255, 255, 255)',
  BLACK = 'rgb(0, 0, 0)';

describe('createColorScale', () => {
  it('returns a scale of the given color', () => {
    const scale = createColorScale({ color: [WHITE, BLACK] });
    expect(scale(0)).toEqual(WHITE);
    expect(scale(1)).toEqual(BLACK);
  });

  it('accepts custom domains', () => {
    const scale = createColorScale({
      color: [WHITE, BLACK],
      domain: [10, 100],
    });
    expect(scale(10)).toEqual(WHITE);
    expect(scale(100)).toEqual(BLACK);
  });

  it('reverses the scale', () => {
    const scale = createColorScale({
      color: [WHITE, BLACK],
      reversed: true,
    });
    expect(scale(0)).toEqual(BLACK);
    expect(scale(1)).toEqual(WHITE);
  });
});
