import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';

import DataDownloadButton, {
  getFilenameFromHeader,
} from './DataDownloadButton';

jest.mock('file-saver');

const mockStore = configureMockStore();

const renderComponent = ({
  url = 'http://test.com/download',
  state = {
    accounts: { user: { customers: [{ type: ADMIN_STATUS.manager }] } },
  },
  adminOnly = undefined,
} = {}) =>
  render(<DataDownloadButton url={url} adminOnly={adminOnly} />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore(state)}>{children}</Provider>
    ),
  });

describe('<DataDownloadButton />', () => {
  it("warns if url isn't supplied and renders nothing", () => {
    console.warn = jest.fn();
    const { queryByRole } = renderComponent({ url: null });
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalled();
  });

  it('does not render if the user is not an admin at all', () => {
    const { queryByRole } = renderComponent({
      state: {
        accounts: { user: { customers: [{ type: ADMIN_STATUS.member }] } },
      },
    });
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders if adminOnly is false', () => {
    const { getByRole } = renderComponent({
      adminOnly: false,
      state: {
        accounts: { user: { customers: [{ type: ADMIN_STATUS.member }] } },
      },
    });
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('renders if the user is an admin of any customers', () => {
    const { getByRole } = renderComponent({
      state: {
        accounts: {
          user: {
            customers: [
              { type: ADMIN_STATUS.manager },
              { type: ADMIN_STATUS.member },
            ],
          },
        },
      },
    });
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('fetches the file when the button is clicked', async () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button'));
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  describe('getFilenameFromHeader', () => {
    it('returns the filename', () => {
      expect(getFilenameFromHeader('attachment; filename=test-file.txt')).toBe(
        'test-file.txt',
      );
    });

    it('returns undefined if attachment is not in the header', () => {
      expect(
        getFilenameFromHeader('thisis something reallyodd'),
      ).toBeUndefined();
    });

    it('returns undefined if filename is not in the header', () => {
      expect(
        getFilenameFromHeader('attachment; something=somethingelse'),
      ).toBeUndefined();
    });

    it('returns filename from the middle of stuff', () => {
      expect(
        getFilenameFromHeader(
          'attachment; randomcrap=useless; filename=test-file.txt; something=somethingelse',
        ),
      ).toBe('test-file.txt');
    });
  });
});
