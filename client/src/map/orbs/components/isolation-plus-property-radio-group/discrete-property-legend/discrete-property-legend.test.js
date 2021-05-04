// @ts-nocheck
import { render } from '@testing-library/react';
import * as React from 'react';
import { DiscretePropertyLegend } from './discrete-property-legend.component';

const PROPERTY = {
  categories: {
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
  },
};
describe('<DiscretePropertyLegend />', () => {
  it('Shows a list item for each category', () => {
    const { getByRole } = render(
      <DiscretePropertyLegend property={PROPERTY} />,
    );
    Object.keys(PROPERTY.categories).map(key =>
      expect(
        getByRole('listitem', { name: new RegExp(key, 'i') }),
      ).toBeInTheDocument(),
    );
  });

  it('Shows a color icon if the property has color', () => {
    const { getAllByRole } = render(
      <DiscretePropertyLegend property={PROPERTY} />,
    );
    expect(getAllByRole('presentation')).toHaveLength(2);
  });

  it('Shows an info icon if the category has a description', () => {
    const { getAllByRole } = render(
      <DiscretePropertyLegend property={PROPERTY} />,
    );
    expect(getAllByRole('button', { name: 'Info' })).toHaveLength(2);
  });
});
