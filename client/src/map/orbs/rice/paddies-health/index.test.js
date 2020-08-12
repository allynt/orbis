import { paddiesHealthLayer } from '.';

describe('paddiesHealthLayer', () => {
  describe('getFillColor', () => {
    it('returns a color based on the average of the `ndvi` property', () => {
      const paddy = {
        properties: {
          ndvi: [
            { timestamp: new Date(1970), value: 1 },
            { timestamp: new Date(1980), value: 2 },
            { timestamp: new Date(1990), value: 3 },
          ],
        },
      };
      const result = paddiesHealthLayer({
        id: 'test',
        dateRange: { min: -Infinity, max: Infinity },
      }).props.getFillColor(paddy);
      expect(result).toHaveLength(4);
    });
  });

  describe('getElevation', () => {
    it('returns a number based on the `lai_cab` property', () => {
      const paddy = {
        properties: {
          lai_cab: [
            { timestamp: new Date(1970), value: 1 },
            { timestamp: new Date(1980), value: 2 },
            { timestamp: new Date(1990), value: 3 },
          ],
        },
      };
      const result = paddiesHealthLayer({
        id: 'test',
        dateRange: { min: -Infinity, max: Infinity },
      }).props.getElevation(paddy);
      expect(result).toBe(2);
    });

    it('bases the elevation on an average for the given date range', () => {
      const paddy = {
        properties: {
          lai_cab: [
            { timestamp: new Date(1970), value: 1 },
            { timestamp: new Date(1980), value: 2 },
            { timestamp: new Date(1990), value: 3 },
          ],
        },
      };
      const result = paddiesHealthLayer({
        id: 'test',
        dateRange: { min: -Infinity, max: new Date(1980) },
      }).props.getElevation(paddy);
      expect(result).toBe(1.5);
    });
  });
});
