import { hexToRgbArray } from 'utils/color';

import geoJsonLayer, { DEFAULT_LINE_COLOR } from './geoJsonConfig.js';

const setup = ({ orbState = undefined } = {}) =>
  geoJsonLayer({
    id: 'test/layer',
    orbState: {
      ...orbState,
      layers: {
        ...orbState?.layers,
        'test/layer': {
          ...orbState?.layers?.['test/layer'],
          data: 'data/url',
        },
      },
    },
    filled: true,
    stroked: true,
    lineColor: '#00ff00',
    filledColor: 'black',
    highlightColor: 'yellow',
  });
it('test line color', () => {
  const result = setup();
  const lineColor = result.getLineColor();
  expect(lineColor).toEqual(DEFAULT_LINE_COLOR);
});
