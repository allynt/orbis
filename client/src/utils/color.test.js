import { ColorScale, createColorScale } from './color';

const HEX_WHITE = '#ffffff',
  HEX_BLACK = '#000000',
  RGB_WHITE = 'rgb(255, 255, 255)',
  RGB_BLACK = 'rgb(0, 0, 0)',
  ARRAY_WHITE = [255, 255, 255],
  ARRAY_BLACK = [0, 0, 0];

describe.skip('createColorScale', () => {
  it('returns a scale of the given color', () => {
    const scale = createColorScale({ color: [HEX_WHITE, HEX_BLACK] });
    expect(scale(0)).toEqual(HEX_WHITE);
    expect(scale(1)).toEqual(HEX_BLACK);
  });

  it('accepts custom domains', () => {
    const scale = createColorScale({
      color: [HEX_WHITE, HEX_BLACK],
      domain: [10, 100],
    });
    expect(scale(10)).toEqual(HEX_WHITE);
    expect(scale(100)).toEqual(HEX_BLACK);
  });

  it('reverses the scale', () => {
    const scale = createColorScale({
      color: [HEX_WHITE, HEX_BLACK],
      reversed: true,
    });
    expect(scale(0)).toEqual(HEX_BLACK);
    expect(scale(1)).toEqual(HEX_WHITE);
  });

  it('reverses the scale with named colors', () => {
    const scale = createColorScale({ reversed: true });
    expect(scale(0)).toBe(HEX_BLACK);
    expect(scale(1)).toBe(HEX_WHITE);
  });
});

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
});
