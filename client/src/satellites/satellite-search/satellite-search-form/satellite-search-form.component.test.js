import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SatelliteSearchForm, {
  savedSearchToFormValues,
} from './satellite-search-form.component';

describe('savedSearchToFormValues', () => {
  it('must spread the satellites array correctly', () => {
    const savedSearch = {
      satellites: ['sentinel-1', 'sentinel-2', 'sentinel-3'],
    };
    const expected = {
      'sentinel-1': true,
      'sentinel-2': true,
      'sentinel-3': true,
    };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });

  describe('must not spread satellites if none exist', () => {
    it('empty array', () => {
      const savedSearch = { satellites: [] };
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });

    it('undefined', () => {
      const savedSearch = {};
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });
  });

  it('must spread the tiers array correctly', () => {
    const savedSearch = { tiers: ['free', 'high'] };
    const expected = { free: true, high: true };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });

  describe('must not spread tiers if none exist', () => {
    it('empty array', () => {
      const savedSearch = { tiers: [] };
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });

    it('undefined', () => {
      const savedSearch = {};
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });
  });

  it('must spread each array when both are present', () => {
    const savedSearch = {
      satellites: ['sentinel-1', 'sentinel-2', 'sentinel-3'],
      tiers: ['free', 'high'],
    };
    const expected = {
      'sentinel-1': true,
      'sentinel-2': true,
      'sentinel-3': true,
      free: true,
      high: true,
    };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });
});

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

  it('Calls onSubmit with the new values when submitted', () => {
    const onSubmit = jest.fn();
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: i.toString(),
        label: `Satellite ${i}`,
      }));
    const expected = {
      satellites: ['0', '2'],
      start_date: expect.stringContaining(''),
      end_date: expect.stringContaining(''),
      tiers: ['free', 'high'],
    };
    const { getByRole } = render(
      <SatelliteSearchForm satellites={satellites} onSubmit={onSubmit} />,
    );
    [
      'Satellite 0',
      'Satellite 2',
      'Free images',
      'High-resolution',
    ].forEach(name => userEvent.click(getByRole('checkbox', { name })));
    userEvent.click(getByRole('button', { name: 'Search' }));
    expect(onSubmit).toBeCalledWith(expected);
  });

  it('Uses the existing search if available', () => {
    const satellites = Array(5)
      .fill()
      .map((_, i) => ({
        id: i.toString(),
        label: `Satellite ${i}`,
      }));
    const currentSearch = {
      satellites: ['3', '4'],
      // start_date: new Date(2000, 0, 0).toISOString(),
      // end_date: new Date(2001, 0, 0).toISOString(),
      tiers: ['mid', 'high'],
    };
    const { getByRole } = render(
      <SatelliteSearchForm
        satellites={satellites}
        // currentSearch={currentSearch}
      />,
    );
    expect(getByRole('checkbox', { name: 'Satellite 3' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Satellite 4' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Mid-resolution' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'High-resolution' })).toBeChecked();
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
});
