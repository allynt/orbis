import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OrbDetails } from './orb-details.component';

const orbs = [
  { id: 1, name: 'Orb 1 Name', description: 'Orb 1 Description', images: [''] },
  { id: 2, name: 'Orb 2 Name', description: 'Orb 2 Description', images: [''] },
];

const renderComponent = () => {
  const goBack = jest.fn();
  const utils = render(
    <OrbDetails
      // @ts-ignore
      orbs={orbs}
      // @ts-ignore
      match={{ params: { orbId: '1' } }}
      // @ts-ignore
      history={{ goBack }}
    />,
  );
  return { ...utils, goBack };
};

describe('<OrbDetails />', () => {
  it('Shows the name of the orb from the route', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('heading', { name: orbs[0].name })).toBeInTheDocument();
  });

  it('Shows the description of the orb from the route', () => {
    const { getByText } = renderComponent();
    expect(getByText(orbs[0].description)).toBeInTheDocument();
  });

  it('Shows the product images', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('img', { name: 'Orb 1 Name Example' }),
    ).toBeInTheDocument();
  });

  it('Goes back when the back button is clicked', () => {
    const { getByRole, goBack } = renderComponent();
    userEvent.click(getByRole('link', { name: 'Back' }));
    expect(goBack).toBeCalled();
  });
});
