import React from 'react';

import { rest } from 'msw';

import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { server } from 'mocks/server';
import { render, waitFor, screen, userEvent } from 'test/test-utils';

import DataDownloadButton, {
  getFilenameFromHeader,
} from './DataDownloadButton';

jest.mock('file-saver');

const setup = ({
  url = 'http://test.com/download',
  state = {
    accounts: { user: { customers: [{ type: ADMIN_STATUS.manager }] } },
  },
  adminOnly = undefined,
} = {}) =>
  render(<DataDownloadButton url={url} adminOnly={adminOnly} />, {
    state,
  });

describe('<DataDownloadButton />', () => {
  it("warns if url isn't supplied and renders nothing", () => {
    console.warn = jest.fn();
    setup({ url: null });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalled();
  });

  it('does not render if the user is not an admin at all', () => {
    setup({
      state: {
        accounts: { user: { customers: [{ type: ADMIN_STATUS.member }] } },
      },
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders if adminOnly is false', () => {
    setup({
      adminOnly: false,
      state: {
        accounts: { user: { customers: [{ type: ADMIN_STATUS.member }] } },
      },
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders if the user is an admin of any customers', () => {
    setup({
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

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('fetches the file when the button is clicked', async () => {
    server.use(
      rest.get('*/download', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const origFetch = global.fetch;
    const fetchMock = jest.spyOn(window, 'fetch');

    setup();

    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    global.fetch = origFetch;
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
