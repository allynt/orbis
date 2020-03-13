import { getBoundsOfGeometry, getCenterOfGeometry } from './geometry';

const aoi = [
  [-4.570311, 12.757874],
  [7.119142, 13.197327],
  [5.888673, 9.066467],
  [-0.263671, 9.242249],
  [-0.263671, 9.242249],
  [-4.570311, 12.757874]
];

describe('getBoundsOfGeometry', () => {
  describe('return value', () => {
    it('should return an array', () => {
      const result = getBoundsOfGeometry(aoi);
      expect(Array.isArray(result)).toEqual(true);
    });

    it('should return an array of arrays', () => {
      const result = getBoundsOfGeometry(aoi);
      for (let item of result) {
        expect(Array.isArray(item)).toEqual(true);
      }
    });

    it('should return an array of arrays of length 2', () => {
      const result = getBoundsOfGeometry(aoi);
      for (let item of result) {
        expect(item).toHaveLength(2);
      }
    });

    it('should return an array of arrays of numbers', () => {
      const result = getBoundsOfGeometry(aoi);
      for (let item of result) {
        for (let value of item) {
          expect(typeof value).toEqual('number');
        }
      }
    });
  });

  describe('typechecking', () => {
    it('Should throw a TypeError when no geometry is provided', () => {
      expect(() => getBoundsOfGeometry()).toThrowError(TypeError);
    });

    describe('should throw a TypeError when geometry is of wrong type', () => {
      it('string', () => {
        expect(() => getBoundsOfGeometry('test')).toThrowError(TypeError);
      });

      it('number', () => {
        expect(() => getBoundsOfGeometry(1)).toThrowError(TypeError);
      });

      it('object', () => {
        expect(() => getBoundsOfGeometry({ test: 'test' })).toThrowError(TypeError);
      });
    });

    it('should throw a RangeError when geometry is empty', () => {
      expect(() => getBoundsOfGeometry([])).toThrowError(RangeError);
    });
  });
});

describe('getCenterOfGeometry', () => {
  describe('return value', () => {
    it('should return an array', () => {
      const result = getCenterOfGeometry(aoi);
      expect(Array.isArray(result)).toEqual(true);
    });

    it('should return an array of length 2', () => {
      const result = getCenterOfGeometry(aoi);
      expect(result).toHaveLength(2);
    });

    it('should return an array of numbers', () => {
      const result = getCenterOfGeometry(aoi);
      for (let item of result) {
        expect(typeof item).toBe('number');
      }
    });
  });

  describe('typechecking', () => {
    it('Should throw a TypeError when no geometry is provided', () => {
      expect(() => getCenterOfGeometry()).toThrowError(TypeError);
    });

    describe('should throw a TypeError when geometry is of wrong type', () => {
      it('string', () => {
        expect(() => getCenterOfGeometry('test')).toThrowError(TypeError);
      });

      it('number', () => {
        expect(() => getCenterOfGeometry(1)).toThrowError(TypeError);
      });

      it('object', () => {
        expect(() => getCenterOfGeometry({ test: 'test' })).toThrowError(TypeError);
      });
    });

    it('should throw a TypeError when geometry is empty', () => {
      expect(() => getCenterOfGeometry([])).toThrowError(RangeError);
    });
  });
});
