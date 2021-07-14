import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchForm from './search-form.component';

describe('<SearchForm />', () => {
  it('Shows a checkbox for each available satellite', () => {
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: i,
        label: `Satellite ${i}`,
      }));
    const { getByRole } = render(<SearchForm satellites={satellites} />);
    satellites.forEach(satellite =>
      expect(
        getByRole('checkbox', { name: satellite.label }),
      ).toBeInTheDocument(),
    );
  });

  it('Calls onSubmit with the new values when submitted', async () => {
    const onSubmit = jest.fn();
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: `sat${i}`,
        label: `Satellite ${i}`,
      }));
    const expected = {
      satellites: ['sat0', 'sat2'],
      start_date: expect.stringContaining(''),
      end_date: expect.stringContaining(''),
      tiers: ['free', 'high'],
    };
    const { getByRole } = render(
      <SearchForm
        satellites={satellites}
        currentSearch={{}}
        aoi={[[]]}
        onSubmit={onSubmit}
      />,
    );
    [
      'Satellite 0',
      'Satellite 2',
      'Free images',
      'High-resolution',
    ].forEach(name => userEvent.click(getByRole('checkbox', { name })));
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(onSubmit).toBeCalledWith(expected));
  });

  it('Uses the existing search if available', () => {
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: `sat${i}`,
        label: `Satellite ${i}`,
      }));
    const currentSearch = {
      satellites: ['sat3', 'sat4'],
      start_date: new Date(2000, 0, 0).toISOString(),
      end_date: new Date(2001, 0, 0).toISOString(),
      tiers: ['mid', 'high'],
    };
    const { getByRole } = render(
      <SearchForm satellites={satellites} currentSearch={currentSearch} />,
    );
    expect(getByRole('checkbox', { name: 'Satellite 3' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Satellite 4' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Mid-resolution' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'High-resolution' })).toBeChecked();
    expect(getByRole('button', { name: '1999-12-31' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2000-12-31' })).toBeInTheDocument();
  });

  it('Shows an error and disables the search button if geometry is too large', () => {
    const { getByText, getByRole } = render(<SearchForm aoiTooLarge />);
    expect(getByRole('alert')).toBeInTheDocument();
    expect(
      getByText('AOI is too large, redraw or zoom in'),
    ).toBeInTheDocument();
    expect(getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it("Disables the search button if there's no aoi drawn", () => {
    const { getByRole } = render(<SearchForm />);
    expect(getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('Enables the search button if an aoi has been drawn', () => {
    const { getByRole } = render(
      <SearchForm
        aoi={[
          [123, 123],
          [345, 345],
        ]}
      />,
    );
    expect(getByRole('button', { name: 'Search' })).not.toBeDisabled();
  });

  it('Calls onInfoClick when an info button is clicked', () => {
    const onInfoClick = jest.fn();
    const { getAllByRole } = render(<SearchForm onInfoClick={onInfoClick} />);
    userEvent.click(getAllByRole('button', { name: 'Info' })[0]);
    expect(onInfoClick).toBeCalled();
  });
});
