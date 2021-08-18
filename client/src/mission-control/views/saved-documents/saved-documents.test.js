import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SavedDocuments from './saved-documents.component';

const mockStore = createMockStore([thunk]);

const DEFAULT_ROUTE = 'mission-control/saved-documents';

const TEST_DOCUMENTS = [
  {
    title: 'Test-title-1',
    date: '12-05-2020',
  },
  {
    title: 'Test-title-2',
    date: '12-06-2020',
  },
  {
    title: 'Test-title-3',
    date: '12-07-2020',
  },
];

const renderComponent = ({ initialEntries = [DEFAULT_ROUTE] }) => {
  const utils = render(
    <Provider
      store={mockStore({
        missionControl: {
          savedDocuments: TEST_DOCUMENTS,
        },
      })}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <SavedDocuments />
      </MemoryRouter>
    </Provider>,
  );
  return { ...utils };
};

describe('Saved Documents', () => {
  it('renders asaved documents table', () => {
    const { getByText } = renderComponent({});

    TEST_DOCUMENTS.forEach(doc => {
      expect(getByText(doc.title)).toBeInTheDocument();
      expect(getByText(doc.date)).toBeInTheDocument();
    });
  });

  it('sorts alphabetically when icon is clicked', () => {
    const { getByText } = renderComponent({});
  });

  it('sorts by date when icon is clicked', () => {
    const { getByText } = renderComponent({});
  });

  it('opens document in new tab when PDF icon is clicked', () => {
    const { getByText } = renderComponent({});
  });
});
