import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import { LicenceDashboard } from './licence-dashboard.component';

const mockStore = createMockStore();

const renderComponent = (state = {}) => {
  const store = mockStore(state);
  const utils = render(<LicenceDashboard />, {
    wrapper: props => <Provider store={store} {...props} />,
  });
  return { ...utils, store };
};

describe('<LicenceDashboard />', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty object', {}],
  ])('Displays text when licences are %s', (_, value) => {
    const { getByText } = renderComponent({});
    expect(getByText('No Licences Available')).toBeInTheDocument();
  });
});
