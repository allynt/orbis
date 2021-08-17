import React from 'react';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = createMockStore([thunk]);

import { SavedDocuments } from './saved-documents.component';

export default { title: 'Mission Control/Saved Documents' };

const Template = args => {
  return (
    <Provider
      store={mockStore({
        missionControl: {}
      })}>
      <MemoryRouter initialEntries={args.initialEntries}>
        <SavedDocuments {...args} />
      </MemoryRouter>
    </Provider>
  )
};

export const Default = Template.bind({});
Default.args = {
  initialEntries: '/mission-control/saved-documents'
};
