import { createColorScale } from './color';

const WHITE = '#ffffff',
  BLACK = '#000000';

describe('createColorScale', () => {
  it('returns a scale of the given color', () => {
    const scale = createColorScale({ color: [WHITE, BLACK] });
    expect(scale(0).hex()).toEqual(WHITE);
    expect(scale(1).hex()).toEqual(BLACK);
  });

  it('accepts custom domains', () => {
    const scale = createColorScale({
      color: [WHITE, BLACK],
      domain: [10, 100],
    });
    expect(scale(10).hex()).toEqual(WHITE);
    expect(scale(100).hex()).toEqual(BLACK);
  });

  it('reverses the scale', () => {
    const scale = createColorScale({
      color: [WHITE, BLACK],
      reverse: true,
    });
    expect(scale(0).hex()).toEqual(BLACK);
    expect(scale(1).hex()).toEqual(WHITE);
  });
});
