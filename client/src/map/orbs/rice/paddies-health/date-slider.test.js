import React from 'react';
import { render } from '@testing-library/react';
import { DateSlider } from './date-slider.component';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const maxDateRange = { min: new Date(1970, 0, 1), max: new Date(2000, 0, 1) };
const mockStore = configureMockStore();

const setup = () => {
  const store = mockStore({ orbs: { rice: { maxDateRange } } });
  const utils = render(
    <Provider store={store}>
      <DateSlider />
    </Provider>,
  );
  return { ...utils, store };
};

describe('<DateSlider />', () => {
  it('shows labels for the maxDateRange', () => {
    const { getAllByText } = setup();
    expect(getAllByText('01/01/1970')).toHaveLength(2);
    expect(getAllByText('01/01/2000')).toHaveLength(2);
  });
});
