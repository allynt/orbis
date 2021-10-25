// @ts-nocheck
import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FeatureDialog } from './feature-dialog.component';

const FEATURE = {
  properties: {
    Fruit: 'Apple',
    Car: 'Super',
    Money: 1000000,
  },
};

const renderComponent = ({
  feature = FEATURE,
  whitelist,
  blacklist,
  titleProperty,
} = {}) => {
  const onClose = jest.fn();
  const utils = render(
    <FeatureDialog
      open
      feature={feature}
      titleProperty={titleProperty}
      whitelist={whitelist}
      blacklist={blacklist}
      onClose={onClose}
    />,
  );
  return { onClose, ...utils };
};

describe('<FeatureDialog />', () => {
  it('Shows all the keys and values of the feature', () => {
    const { getByText } = renderComponent();
    Object.entries(FEATURE.properties).forEach(([key, value]) => {
      expect(getByText(key)).toBeInTheDocument();
      expect(getByText(value.toString())).toBeInTheDocument();
    });
  });

  it('Shows the `titleProperty` as the title if specified and does not show in the body', () => {
    const { getByRole, queryByText } = renderComponent({
      titleProperty: 'Car',
    });
    expect(
      getByRole('heading', { name: FEATURE.properties.Car }),
    ).toBeInTheDocument();
    expect(queryByText('Car')).not.toBeInTheDocument();
  });

  it('Does not show properties excluded by `blacklist`', () => {
    const { queryByText } = renderComponent({ blacklist: ['Money', 'Fruit'] });
    expect(queryByText('Money')).not.toBeInTheDocument();
    expect(
      queryByText(FEATURE.properties.Money.toString()),
    ).not.toBeInTheDocument();
    expect(queryByText('Fruit')).not.toBeInTheDocument();
    expect(queryByText(FEATURE.properties.Fruit)).not.toBeInTheDocument();
  });

  it('Only shows properties in `whitelist`', () => {
    const { queryByText } = renderComponent({ whitelist: ['Fruit', 'Car'] });
    expect(queryByText('Money')).not.toBeInTheDocument();
    expect(
      queryByText(FEATURE.properties.Money.toString()),
    ).not.toBeInTheDocument();
  });

  it('Calls `onClose` when close is clicked', () => {
    const { getByRole, onClose } = renderComponent();
    userEvent.click(getByRole('button', { name: /Close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('Warns if `blacklist` and `whitelist` are used together', () => {
    console.warn = jest.fn();
    renderComponent({ blacklist: ['Money'], whitelist: ['Car'] });
    expect(console.warn).toHaveBeenCalled();
  });
});
