import React from 'react';
import { render } from '@testing-library/react';
import Admin from './admin.component';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';

const mockStore = configureMockStore([thunk]);

const setup = () => {
  fetch.mockResponse(
    JSON.stringify({
      id: 0,
      name: 'test-customer',
      title: 'Test Customer',
    }),
  );

  return render(
    <Provider
      store={mockStore({
        accounts: { userKey: '123abc' },
        admin: {},
      })}
    >
      <Admin user={{ customers: [{ type: 'MANAGER', name: 'test-customer' }] }} />
    </Provider>,
  );
};

describe('<Admin />', () => {
  describe('Create User Dialog', () => {
    it('Displays the Create User dialog when the Create User Button is clicked', () => {
      const { getByText, getByRole } = setup();
      userEvent.click(getByText('Create User'));
      const dialog = getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent('Create New User');
    });

    it('Closes the Create User Dialog when the close button is clicked', () => {
      const { getByText, getByRole, getByLabelText, queryByRole } = setup();
      userEvent.click(getByText('Create User'));
      expect(getByRole('dialog')).toBeInTheDocument();
      userEvent.click(getByLabelText('Close'));
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
