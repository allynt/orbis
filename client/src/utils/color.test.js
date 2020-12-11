import { ColorScale, createColorScale } from './color';

const WHITE = '#ffffff',
  BLACK = '#000000';

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

  it('reverses the scale with named colors', () => {
    const scale = createColorScale({ reversed: true });
    expect(scale(0)).toBe(BLACK);
    expect(scale(1)).toBe(WHITE);
  });
});

describe.only('ColorScale', () => {
  let scale;

  beforeEach(() => {
    scale = undefined;
  });

  it('Returns a color for the given value using defaults', () => {
    const scale = new ColorScale();
    expect(scale.get(0)).toBe(WHITE);
    expect(scale.get(1)).toBe(BLACK);
  });

  describe('returns a color for a custom domain', () => {
    afterEach(() => {
      expect(scale.get(10)).toBe(WHITE);
      expect(scale.get(100)).toBe(BLACK);
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
      expect(scale.get(0)).toBe(BLACK);
      expect(scale.get(1)).toBe(WHITE);
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
      expect(scale.get(10)).toBe(WHITE);
      expect(scale.get(90)).toBe(BLACK);
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
    expect(scale.get(0)).toBe(WHITE);
    expect(scale.get(10)).toBe(WHITE);
    expect(scale.get(100)).toBe(BLACK);
    expect(scale.get(90)).toBe(BLACK);
    scale.clip = false;
    expect(scale.get(0)).toBe(WHITE);
    expect(scale.get(10)).not.toBe(WHITE);
    expect(scale.get(100)).toBe(BLACK);
    expect(scale.get(90)).not.toBe(BLACK);
  });

  describe('returns colors in different formats', () => {
    describe('hex', () => {
      afterEach(() => {
        expect(scale.get(0)).toBe('#ffffff');
        expect(scale.get(1)).toBe('#000000');
      });

      it('constructor', () => {
        scale = new ColorScale({ format: 'hex' });
      });

      it('setter', () => {
        scale = new ColorScale();
        scale.format = 'hex';
      });
    });

    describe('rgb', () => {
      afterEach(() => {
        expect(scale.get(0)).toBe('rgb(0, 0, 0)');
        expect(scale.get(1)).toBe('rgb(255, 255, 255)');
      });

      it('constructor', () => {
        scale = new ColorScale({ format: 'rgb' });
      });

      it('setter', () => {
        scale = new ColorScale();
        scale.format = 'rgb';
      });
    });

    describe('array', () => {
      afterEach(() => {
        expect(scale.get(0)).toEqual([0, 0, 0]);
        expect(scale.get(1)).toBe([255, 255, 255]);
      });

      it('constructor', () => {
        scale = new ColorScale({ format: 'array' });
      });

      it('setter', () => {
        scale = new ColorScale();
        scale.format = 'array';
      });
    });
  });
});
