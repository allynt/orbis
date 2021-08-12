import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import { Subscriptions } from './subscriptions.component';

const licenceInformation = {
  Rice: {
    purchased: 4,
    active: 2,
    available: 1,
    pending: 1,
  },
  Oil: {
    purchased: 2,
    active: 2,
    available: 0,
    pending: 0,
  },
  Health: {
    purchased: 3,
    active: 1,
    available: 1,
    pending: 1,
  },
};

jest.mock('mission-control/mission-control.slice', () => ({
  ...jest.requireActual('mission-control/mission-control.slice'),
  selectLicenceInformation: jest.fn().mockReturnValue({
    Rice: {
      purchased: 4,
      active: 2,
      available: 1,
      pending: 1,
    },
    Oil: {
      purchased: 2,
      active: 2,
      available: 0,
      pending: 0,
    },
    Health: {
      purchased: 3,
      active: 1,
      available: 1,
      pending: 1,
    },
  }),
}));

const mockStore = createMockStore();

const renderComponent = (state = {}) => {
  const store = mockStore(state);
  const utils = render(<Subscriptions />, {
    wrapper: props => <Provider store={store} {...props} />,
  });
  return { ...utils, store };
};

describe('<Subscriptions />', () => {
  it('Displays a row for each orb', () => {
    const { getByText } = renderComponent();
    ['Rice', 'Oil', 'Health'].forEach(orb =>
      expect(getByText(orb)).toBeInTheDocument(),
    );
  });

  it('Displays the total purchased licences for each orb', () => {
    const { getByText } = renderComponent();
    [
      ['Rice', licenceInformation.Rice.purchased],
      ['Oil', licenceInformation.Oil.purchased],
      ['Health', licenceInformation.Health.purchased],
    ].forEach(([orb, count]) =>
      expect(getByText(orb).parentElement).toHaveTextContent(count),
    );
  });

  it('Displays the total active licences for each orb', () => {
    const { getByText } = renderComponent();
    [
      ['Rice', licenceInformation.Rice.active],
      ['Oil', licenceInformation.Oil.active],
      ['Health', licenceInformation.Health.active],
    ].forEach(([orb, count]) =>
      expect(getByText(orb).parentElement).toHaveTextContent(count),
    );
  });

  it('Displays the total available licences for each orb', () => {
    const { getByText } = renderComponent();
    [
      ['Rice', licenceInformation.Rice.available],
      ['Oil', licenceInformation.Oil.available],
      ['Health', licenceInformation.Health.available],
    ].forEach(([orb, count]) =>
      expect(getByText(orb).parentElement).toHaveTextContent(count),
    );
  });
});
