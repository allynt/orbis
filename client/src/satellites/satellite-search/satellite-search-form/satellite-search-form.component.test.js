import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SatelliteSearchForm from './satellite-search-form.component';

describe('<SearchForm />', () => {
  it('Shows a checkbox for each available satellite', () => {
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: i,
        label: `Satellite ${i}`,
      }));
    const { getByRole } = render(
      <SatelliteSearchForm satellites={satellites} />,
    );
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
      <SatelliteSearchForm
        satellites={satellites}
        currentSearch={{}}
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
      <SatelliteSearchForm
        satellites={satellites}
        currentSearch={currentSearch}
      />,
    );
    expect(getByRole('checkbox', { name: 'Satellite 3' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Satellite 4' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Mid-resolution' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'High-resolution' })).toBeChecked();
    expect(getByRole('button', { name: '1999-12-31' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2000-12-31' })).toBeInTheDocument();
  });

  it('Shows an error if geometry is too large', () => {
    const { getByText, getByRole } = render(
      <SatelliteSearchForm geometryTooLarge />,
    );
    expect(getByRole('alert')).toBeInTheDocument();
    expect(
      getByText('AOI is too large, redraw or zoom in'),
    ).toBeInTheDocument();
  });

  it('Calls onInfoClick when an info button is clicked', () => {
    const onInfoClick = jest.fn();
    const { getAllByRole } = render(
      <SatelliteSearchForm onInfoClick={onInfoClick} />,
    );
    userEvent.click(getAllByRole('button', { name: 'Info' })[0]);
    expect(onInfoClick).toBeCalled();
  });
});
