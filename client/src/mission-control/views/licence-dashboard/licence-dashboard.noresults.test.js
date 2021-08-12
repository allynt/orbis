import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import { Subscriptions } from './licence-dashboard.component';

const mockStore = createMockStore();

const renderComponent = (state = {}) => {
  const store = mockStore(state);
  const utils = render(<Subscriptions />, {
    wrapper: props => <Provider store={store} {...props} />,
  });
  return { ...utils, store };
};

describe('<Subscriptions />', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty object', {}],
  ])('Displays text when licences are %s', (_, value) => {
    const { getByText } = renderComponent({});
    expect(getByText('No Licences Available')).toBeInTheDocument();
  });
});
