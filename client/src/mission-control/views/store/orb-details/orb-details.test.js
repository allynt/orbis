import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { OrbDetails } from './orb-details.component';

const orbs = [
  { id: 1, name: 'Orb 1 Name', description: 'Orb 1 Description', images: [''] },
  { id: 2, name: 'Orb 2 Name', description: 'Orb 2 Description', images: [''] },
];

const renderComponent = () => {
  const history = createMemoryHistory();
  history.goBack = jest.fn();
  const utils = render(
    <OrbDetails
      // @ts-ignore
      orbs={orbs}
      // @ts-ignore
      match={{ params: { orbId: '1' } }}
      // @ts-ignore
      history={history}
    />,
    {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    },
  );
  return { ...utils, history };
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
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('link', { name: 'Back' }));
    expect(history.goBack).toBeCalled();
  });

  it('Has a minimum users of 3 and maximum of 30', () => {
    const { getByRole, queryByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: /Number of Users/i }));
    expect(getByRole('option', { name: /^3$/ })).toBeInTheDocument();
    expect(getByRole('option', { name: /30/ })).toBeInTheDocument();
    expect(queryByRole('option', { name: /^2$/ })).not.toBeInTheDocument();
    expect(queryByRole('option', { name: /31/ })).not.toBeInTheDocument();
  });

  it('Navigates to the checkout view with the orb and number of seats as params', () => {
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('button', { name: /Number of Users/i }));
    userEvent.click(getByRole('option', { name: '5' }));
    userEvent.click(getByRole('link', { name: /get access/i }));
    expect(history.location.pathname).toContain('/checkout');
    expect(history.location.search).toBe('?orbId=1&users=5');
  });
});
