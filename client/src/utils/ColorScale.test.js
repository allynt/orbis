import { ColorScale } from './ColorScale';

const HEX_WHITE = '#ffffff',
  HEX_BLACK = '#000000',
  RGB_WHITE = 'rgb(255, 255, 255)',
  RGB_BLACK = 'rgb(0, 0, 0)',
  ARRAY_WHITE = [255, 255, 255],
  ARRAY_BLACK = [0, 0, 0];

describe('ColorScale', () => {
  let scale;

  beforeEach(() => {
    scale = undefined;
  });

  it('Returns a color for the given value using defaults', () => {
    const scale = new ColorScale();
    expect(scale.get(0)).toBe(HEX_WHITE);
    expect(scale.get(1)).toBe(HEX_BLACK);
  });

  describe('continuous scale', () => {
    describe('returns a color for a custom domain', () => {
      afterEach(() => {
        expect(scale.get(10)).toBe(HEX_WHITE);
        expect(scale.get(100)).toBe(HEX_BLACK);
      });

      it('constructor', () => {
        scale = new ColorScale({ domain: [10, 100] });
      });

      it('setter', () => {
        scale = new ColorScale();
        scale.domain = [10, 100];
      });
    });

    describe('allows different colors', () => {
      describe('named', () => {
        const color = 'OrRd';

        afterEach(() => {
          expect(scale.get(0)).toBe('#fff7ec');
          expect(scale.get(1)).toBe('#7f0000');
        });

        it('constructor', () => {
          scale = new ColorScale({ color });
        });

        it('setter', () => {
          scale = new ColorScale();
          scale.color = color;
        });
      });

      describe('custom', () => {
        const color = ['#333f48', '#f6be00'];

        afterEach(() => {
          expect(scale.get(0)).toBe(color[0]);
          expect(scale.get(1)).toBe(color[1]);
        });

        it('constructor', () => {
          scale = new ColorScale({ color });
        });

        it('setter', () => {
          scale = new ColorScale();
          scale.color = color;
        });
      });
    });

    describe('reverses the scale if provided', () => {
      afterEach(() => {
        expect(scale.get(0)).toBe(HEX_BLACK);
        expect(scale.get(1)).toBe(HEX_WHITE);
      });

      it('constructor', () => {
        scale = new ColorScale({ reversed: true });
      });

      it('setter', () => {
        scale = new ColorScale();
        scale.reversed = true;
      });
    });

    describe('clips the scale if provided', () => {
      afterEach(() => {
        expect(scale.get(10)).toBe(HEX_WHITE);
        expect(scale.get(90)).toBe(HEX_BLACK);
      });

      it('constructor', () => {
        scale = new ColorScale({ domain: [0, 100], clip: [10, 90] });
      });

      it('setter', () => {
        scale = new ColorScale({ domain: [0, 100] });
        scale.clip = [10, 90];
      });
    });

    it('can unset clipping', () => {
      const scale = new ColorScale({ domain: [0, 100], clip: [10, 90] });
      expect(scale.get(0)).toBe(HEX_WHITE);
      expect(scale.get(10)).toBe(HEX_WHITE);
      expect(scale.get(100)).toBe(HEX_BLACK);
      expect(scale.get(90)).toBe(HEX_BLACK);
      scale.clip = false;
      expect(scale.get(0)).toBe(HEX_WHITE);
      expect(scale.get(10)).not.toBe(HEX_WHITE);
      expect(scale.get(100)).toBe(HEX_BLACK);
      expect(scale.get(90)).not.toBe(HEX_BLACK);
    });

    describe('returns colors in different formats', () => {
      describe('hex', () => {
        const test = () => {
          expect(scale.get(0)).toBe(HEX_WHITE);
          expect(scale.get(1)).toBe(HEX_BLACK);
        };

        it('constructor', () => {
          scale = new ColorScale({ format: 'hex' });
          test();
        });

        it('setter', () => {
          scale = new ColorScale();
          scale.format = 'hex';
          test();
        });

        it('get', () => {
          scale = new ColorScale();
          expect(scale.get(0, 'hex')).toBe(HEX_WHITE);
          expect(scale.get(1, 'hex')).toBe(HEX_BLACK);
        });
      });

      describe('rgb', () => {
        const test = () => {
          expect(scale.get(0)).toBe(RGB_WHITE);
          expect(scale.get(1)).toBe(RGB_BLACK);
        };

        it('constructor', () => {
          scale = new ColorScale({ format: 'rgb' });
          test();
        });

        it('setter', () => {
          scale = new ColorScale();
          scale.format = 'rgb';
          test();
        });

        it('get', () => {
          scale = new ColorScale();
          expect(scale.get(0, 'rgb')).toBe(RGB_WHITE);
          expect(scale.get(1, 'rgb')).toBe(RGB_BLACK);
        });
      });

      describe('array', () => {
        const test = () => {
          expect(scale.get(0)).toEqual(ARRAY_WHITE);
          expect(scale.get(1)).toEqual(ARRAY_BLACK);
        };

        it('constructor', () => {
          scale = new ColorScale({ format: 'array' });
          test();
        });

        it('setter', () => {
          scale = new ColorScale();
          scale.format = 'array';
          test();
        });

        it('get', () => {
          scale = new ColorScale();
          expect(scale.get(0, 'array')).toEqual(ARRAY_WHITE);
          expect(scale.get(1, 'array')).toEqual(ARRAY_BLACK);
        });
      });
    });

    describe('getGradient', () => {
      it('returns an array of colors and stops', () => {
        const scale = new ColorScale();
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_WHITE },
            { stop: 100, color: HEX_BLACK },
          ]),
        );
      });

      it('works with clipped data', () => {
        const scale = new ColorScale({ clip: [0.2, 0.7] });
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_WHITE },
            { stop: 20, color: HEX_WHITE },
            { stop: 70, color: HEX_BLACK },
            { stop: 100, color: HEX_BLACK },
          ]),
        );
      });

      it('works with custom domains', () => {
        const scale = new ColorScale({ domain: [100, 1000] });
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_WHITE },
            { stop: 100, color: HEX_BLACK },
          ]),
        );
      });

      it('works with clipped custom domains', () => {
        const scale = new ColorScale({ domain: [0, 1000], clip: [200, 700] });
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_WHITE },
            { stop: 20, color: HEX_WHITE },
            { stop: 70, color: HEX_BLACK },
            { stop: 100, color: HEX_BLACK },
          ]),
        );
      });

      it('works on tiny numbers', () => {
        const scale = new ColorScale({ domain: [0, 0.01] });
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_WHITE },
            { stop: 100, color: HEX_BLACK },
          ]),
        );
      });

      it('works with reversed', () => {
        const scale = new ColorScale({ reversed: true });
        const gradient = scale.getGradient();
        expect(gradient).toEqual(
          expect.arrayContaining([
            { stop: 0, color: HEX_BLACK },
            { stop: 100, color: HEX_WHITE },
          ]),
        );
      });

      describe('returns color based on format', () => {
        it('when specified in the constructor', () => {
          const scale = new ColorScale({ format: 'rgb' });
          const gradient = scale.getGradient();
          expect(gradient).toEqual(
            expect.arrayContaining([
              { stop: 0, color: RGB_WHITE },
              { stop: 100, color: RGB_BLACK },
            ]),
          );
        });

        it('when specified in the function call', () => {
          const scale = new ColorScale();
          const gradient = scale.getGradient('array');
          expect(gradient).toEqual(
            expect.arrayContaining([
              { stop: 0, color: ARRAY_WHITE },
              { stop: 100, color: ARRAY_BLACK },
            ]),
          );
        });
      });
    });
  });

  describe('discrete scale', () => {
    const DISCRETE_DOMAIN = ['carrot', 'apple', 'tomato', 'banana'],
      DISCRETE_COLORS = ['orange', 'green', 'red', 'yellow'];
    it('Accepts a discrete domain', () => {
      scale = new ColorScale({ domain: DISCRETE_DOMAIN });
      expect(scale.get('carrot')).toBe(HEX_WHITE);
    });

    it('Accepts a discrete domain and custom color range', () => {
      scale = new ColorScale({
        domain: DISCRETE_DOMAIN,
        color: DISCRETE_COLORS,
      });
      expect(scale.get('apple')).toBe('#008000');
    });

    it('Can use predefined sequential color maps', () => {
      scale = new ColorScale({ domain: DISCRETE_DOMAIN, color: 'PuOr' });
      expect(scale.get('tomato')).toBe('#b2abd2');
    });
    it('Can use categorical predefined color maps', () => {
      scale = new ColorScale({ domain: DISCRETE_DOMAIN, color: 'Dark2' });
      expect(scale.get('tomato')).toBe('#7570b3');
    });

    it('Warns if the selected color map does not have the specified number of classes', () => {
      console.warn = jest.fn();
      new ColorScale({ domain: DISCRETE_DOMAIN, color: 'Blues', classes: 20 });
      expect(console.warn).toHaveBeenCalled();
    });

    it('Allows for returning different formats', () => {
      scale = new ColorScale({
        domain: DISCRETE_DOMAIN,
        color: DISCRETE_COLORS,
      });
      expect(scale.get('banana', 'rgb')).toBe('rgb(255, 255, 0)');
      expect(scale.get('banana', 'array')).toEqual([255, 255, 0]);
    });
  });
});
