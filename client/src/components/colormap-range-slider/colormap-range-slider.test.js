import * as React from 'react';
import { render } from '@testing-library/react';
import { default as ColorMapRangeSlider } from './colormap-range-slider.component';

describe('<ColorMapRangeSlider />', () => {
  it('returns a decile slider if type="decile"', () => {
    const { getByRole } = render(<ColorMapRangeSlider type="decile" />);
    expect(
      getByRole('img', { name: 'Decile ColorMap Range Slider' }),
    ).toBeInTheDocument();
  });

  it.each`
    type            | value
    ${'continuous'} | ${'continuous'}
    ${'discrete'}   | ${'discrete'}
    ${'undefined'}  | ${undefined}
  `('returns a continuous slider if type="$type"', value => {
    const { getByRole } = render(<ColorMapRangeSlider type={value} />);
    expect(
      getByRole('img', { name: 'Continuous ColorMap Range Slider' }),
    ).toBeInTheDocument();
  });
});
