import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CheckboxFilters } from './checkbox-filters.component';

const mockStore = configureMockStore([thunk]);

const Index = {
  title: 'Sidebar Components/Checkbox Filters',
  argTypes: { dispatch: { action: 'dispatch' } },
};

export default Index;

const Template = ({ state = {}, ...args }) => (
  <Provider store={mockStore({ orbs: { layers: state } })}>
    <CheckboxFilters {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  selectedLayer: {
    source_id: 'test/layer/1',
  },
};

export const ValueOnly = Template.bind({});
ValueOnly.args = {
  ...Default.args,
  filters: [{ value: 1 }, { value: 2 }, { value: 3 }],
};

export const ValueAndLabel = Template.bind({});
ValueAndLabel.args = {
  ...Default.args,
  filters: [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' },
  ],
};

export const ValueLabelAndIcon = Template.bind({});
ValueLabelAndIcon.args = {
  ...Default.args,
  filters: [
    { value: 1, label: 'One', icon: 'PicnicSite' },
    { value: 2, label: 'Two', icon: 'PlaceOfWorship' },
    { value: 3, label: 'Three', icon: 'SportsPitch' },
  ],
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  ...ValueLabelAndIcon.args,
  color: 'hotpink',
  iconColor: 'white',
};

export const SomeState = Template.bind({});
SomeState.args = {
  ...ValueLabelAndIcon.args,
  state: {
    'test/layer/1': {
      filterValue: [2, 3],
    },
  },
};

export const ColorMap = Template.bind({});
ColorMap.args = {
  ...ValueAndLabel.args,
  colorMap: 'Spectral',
};
