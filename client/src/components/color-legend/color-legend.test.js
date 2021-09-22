// @ts-nocheck
import * as React from 'react';

import { render } from '@testing-library/react';

import { ColorLegend } from './color-legend.component';

const CATEGORIES = {
  apples: {
    color: 'green',
  },
  oranges: {
    color: 'orange',
    description: 'Did the color come first?',
  },
  lime: {
    description: 'Goes in coconut',
  },
};
describe('<ColorLegend />', () => {
  it('Shows a list item for each category', () => {
    const { getByRole } = render(<ColorLegend categories={CATEGORIES} />);
    Object.keys(CATEGORIES).map(key =>
      expect(
        getByRole('listitem', { name: new RegExp(key, 'i') }),
      ).toBeInTheDocument(),
    );
  });

  it('Shows a color icon if the category has color', () => {
    const { getAllByRole } = render(<ColorLegend categories={CATEGORIES} />);
    expect(getAllByRole('presentation')).toHaveLength(2);
  });

  it('Shows an info icon if the category has a description', () => {
    const { getAllByRole } = render(<ColorLegend categories={CATEGORIES} />);
    expect(getAllByRole('button', { name: 'Info' })).toHaveLength(2);
  });
});
