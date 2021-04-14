// @ts-nocheck
import { getColorScaleForProperty, hexToRgbArray } from './color';

describe('getColorScaleForProperty', () => {
  it('Returns a continuous ColorScale for a continuous property', () => {
    const scale = getColorScaleForProperty({
      min: 0,
      max: 10,
      type: 'continuous',
      application: { orbis: { display: { color: 'BuGn' } } },
    });
    expect(scale.get(5)).toBe('#68c2a3');
  });

  it('returns a clipped ColorScale', () => {
    const scale = getColorScaleForProperty({
      min: 0,
      max: 10,
      clip_min: 3,
      clip_max: 8,
      type: 'continuous',
      application: { orbis: { display: { color: 'BuGn' } } },
    });
    expect(scale.get(0)).toBe('#f7fcfd');
    expect(scale.get(3)).toBe('#f7fcfd');
    expect(scale.get(8)).toBe('#00441b');
    expect(scale.get(10)).toBe('#00441b');
  });

  it('Returns a discrete ColorScale for a discrete property with custom colors', () => {
    const scale = getColorScaleForProperty({
      type: 'discrete',
      categories: {
        banana: {
          color: 'yellow',
        },
        carrot: {
          color: 'orange',
        },
      },
    });
    expect(scale.get('carrot')).toBe('#ffa500');
  });
});

describe('hexToRgbArray', () => {
  it('Returns nothing if hexstring is undefined', () => {
    expect(hexToRgbArray()).toBeUndefined();
  });

  it('returns a hex color formatted as RGB array', () => {
    expect(hexToRgbArray('#ffffff')).toEqual([255, 255, 255]);
  });

  it("works if there's no #", () => {
    expect(hexToRgbArray('ffffff')).toEqual([255, 255, 255]);
  });
});
