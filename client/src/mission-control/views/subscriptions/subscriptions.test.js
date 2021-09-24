import React from 'react';

import { render, screen } from 'test/test-utils';

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

const renderComponent = licenceInformation => {
  const utils = render(
    <Subscriptions licenceInformation={licenceInformation} />,
  );
  return { ...utils };
};

describe('<Subscriptions />', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty object', {}],
  ])('Displays text when licences are %s', (_, value) => {
    const { getByText } = renderComponent(value);
    expect(getByText('No Subscriptions Available')).toBeInTheDocument();
  });

  it('Displays a row for each orb', () => {
    render(<Subscriptions licenceInformation={licenceInformation} />);

    ['Rice', 'Oil', 'Health'].forEach(orb =>
      expect(screen.getByText(orb)).toBeInTheDocument(),
    );
  });

  it('Displays the total purchased licences for each orb', () => {
    render(<Subscriptions licenceInformation={licenceInformation} />);

    [
      ['Rice', licenceInformation.Rice.purchased],
      ['Oil', licenceInformation.Oil.purchased],
      ['Health', licenceInformation.Health.purchased],
    ].forEach(([orb, count]) =>
      expect(screen.getByText(orb).parentElement).toHaveTextContent(count),
    );
  });

  it('Displays the total active licences for each orb', () => {
    render(<Subscriptions licenceInformation={licenceInformation} />);

    [
      ['Rice', licenceInformation.Rice.active],
      ['Oil', licenceInformation.Oil.active],
      ['Health', licenceInformation.Health.active],
    ].forEach(([orb, count]) =>
      expect(screen.getByText(orb).parentElement).toHaveTextContent(count),
    );
  });

  it('Displays the total available licences for each orb', () => {
    render(<Subscriptions licenceInformation={licenceInformation} />);

    [
      ['Rice', licenceInformation.Rice.available],
      ['Oil', licenceInformation.Oil.available],
      ['Health', licenceInformation.Health.available],
    ].forEach(([orb, count]) =>
      expect(screen.getByText(orb).parentElement).toHaveTextContent(count),
    );
  });
});
