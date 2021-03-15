import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DataDownloadButton from './DataDownloadButton';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

const mockStore = configureMockStore();

const renderComponent = (url = 'http://test.com/download') =>
  render(<DataDownloadButton url={url} />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore()}>{children}</Provider>
    ),
  });

describe('<DataDownloadButton />', () => {
  it("warns if url isn't supplied and renders nothing", () => {
    console.warn = jest.fn();
    const { queryByRole } = renderComponent(null);
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalled();
  });

  it('creates a fake link to download the file', async () => {
    jest.spyOn(document, 'createElement');
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button'));
    await waitFor(() =>
      expect(document.createElement).toHaveBeenCalledWith('a'),
    );
  });
});
