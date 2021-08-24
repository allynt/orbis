import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SavedDocuments, { TEST_DOCUMENTS } from './saved-documents.component';

const mockStore = createMockStore([thunk]);

const DEFAULT_ROUTE = 'mission-control/saved-documents';

const renderComponent = ({ initialEntries = [DEFAULT_ROUTE] }) => {
  const utils = render(
    <Provider
      store={mockStore({
        accounts: {
          user: { id: 1 },
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

describe.skip('<Saved Documents />', () => {
  it('renders a saved documents table', () => {
    const { getByText } = renderComponent({});

    TEST_DOCUMENTS.forEach(doc => {
      expect(getByText(doc.title)).toBeInTheDocument();
      expect(getByText(doc.date)).toBeInTheDocument();
    });
  });

  it('sorts alphabetically when icon is clicked', () => {
    const { getByRole, getAllByRole } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Name' }));

    const [, ...rows] = getAllByRole('row');

    const sortedRowNames = ['Test-title-1', 'Test-title-2', 'Test-title-3'];

    rows.forEach((row, i) => {
      expect(row.firstChild).toHaveTextContent(sortedRowNames[i]);
    });
  });

  it('sorts by date when icon is clicked', () => {
    const { getByRole, getAllByRole } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Date' }));

    const [, ...rows] = getAllByRole('row');

    const sortedRowNames = ['01-05-2020', '02-05-2020', '03-05-2020'];

    rows.forEach((row, i) => {
      expect(row.secondChild).toHaveTextContent(sortedRowNames[i]);
    });
  });

  it('opens document in new tab when PDF icon is clicked', () => {
    const { getByText } = renderComponent({});
  });
});
