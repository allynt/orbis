import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { endOfDay, startOfDay, subDays } from 'date-fns';

import SearchForm, {
  transform,
  validationSchema,
} from './search-form.component';

const satellites = Array(5)
  .fill()
  .map((_, i) => ({
    id: `sat${i}`,
    label: `Satellite ${i}`,
  }));

jest.setTimeout(60000);

describe.each`
  inSearch                                        | inForm                                                | searchKey       | formKey
  ${['one', 'two', 'three']}                      | ${{ one: true, two: true, three: true, four: false }} | ${'satellites'} | ${'satellites'}
  ${new Date(2000, 0, 1).toISOString()}           | ${'01/01/2000'}                                       | ${'start_date'} | ${'startDate'}
  ${endOfDay(new Date(2000, 0, 1)).toISOString()} | ${'01/01/2000'}                                       | ${'end_date'}   | ${'endDate'}
`('transform', ({ inSearch, inForm, searchKey, formKey }) => {
  describe('toForm', () => {
    it(`Converts ${searchKey} from search to form`, () => {
      const search = {
        [searchKey]: inSearch,
      };
      const satellites = [
        { id: 'one' },
        { id: 'two' },
        { id: 'three' },
        { id: 'four' },
      ];
      const expected = expect.objectContaining({
        [formKey]: inForm,
      });
      expect(transform.toForm(search, satellites)).toEqual(expected);
    });
  });

  describe('toSearch', () => {
    it(`Converts ${formKey} from form to search`, () => {
      const form = {
        [formKey]: inForm,
      };
      const expected = expect.objectContaining({
        [searchKey]: inSearch,
      });
      expect(transform.toSearch(form)).toEqual(expected);
    });
  });
});

describe('validationSchema', () => {
  const passingSchema = {
    satellites: { test: true },
    startDate: '01/01/2000',
    endDate: '01/01/2000',
  };
  it('validates satellites', () => {
    expect(() =>
      validationSchema.validateSync({
        ...passingSchema,
        satellites: { test: false },
      }),
    ).toThrowError('Select at least one satellite');
  });

  describe.each([
    ['startDate', 'Choose a start date'],
    ['endDate', 'Choose an end date'],
  ])('Validates $s', (key, requiredMessage) => {
    it('is required', () => {
      expect(() =>
        validationSchema.validateSync({
          ...passingSchema,
          [key]: '',
        }),
      ).toThrowError(requiredMessage);
    });

    it('is a valid date', () => {
      expect(() =>
        validationSchema.validateSync({
          ...passingSchema,
          [key]: '123456',
        }),
      ).toThrowError('Please use the format DD/MM/YYYY');
    });
  });
});

const renderComponent = ({
  currentSearch = undefined,
  aoiTooLarge = undefined,
  aoi = [[]],
} = {}) => {
  const onSubmit = jest.fn();
  const onInfoClick = jest.fn();
  const utils = render(
    <SearchForm
      satellites={satellites}
      aoi={aoi}
      aoiTooLarge={aoiTooLarge}
      currentSearch={currentSearch}
      onSubmit={onSubmit}
      onInfoClick={onInfoClick}
    />,
  );
  return { ...utils, onSubmit, onInfoClick };
};

describe('<SearchForm />', () => {
  it('Shows a checkbox for each available satellite', () => {
    const { getByRole } = renderComponent();
    satellites.forEach(satellite =>
      expect(
        getByRole('checkbox', { name: satellite.label }),
      ).toBeInTheDocument(),
    );
  });

  it('Allows for changing date using the picker', async () => {
    const expected = {
      satellites: expect.anything(),
      start_date: new Date(2000, 0, 1).toISOString(),
      end_date: endOfDay(new Date(2000, 0, 29)).toISOString(),
    };
    const { getByRole, getAllByRole, onSubmit } = renderComponent({
      currentSearch: {
        satellites: ['sat0'],
        start_date: new Date(2000, 0, 3).toISOString(),
        end_date: new Date(2000, 0, 4).toISOString(),
      },
    });
    userEvent.click(getByRole('button', { name: 'Show date picker' }));
    userEvent.click(getAllByRole('button', { name: '1' })[0]);
    userEvent.click(getAllByRole('button', { name: '29' })[1]);
    userEvent.click(getByRole('button', { name: 'Apply' }));
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(onSubmit).toBeCalledWith(expected));
  });

  it('Calls onSubmit with the new values when submitted', async () => {
    const expected = {
      satellites: ['sat0', 'sat2'],
      start_date: new Date(2000, 0, 1).toISOString(),
      end_date: endOfDay(new Date(2010, 0, 1)).toISOString(),
    };
    const { getByRole, onSubmit } = renderComponent();
    ['Satellite 0', 'Satellite 2'].forEach(name =>
      userEvent.click(getByRole('checkbox', { name })),
    );
    userEvent.clear(getByRole('textbox', { name: 'Start Date' }));
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '01/01/2000');
    userEvent.clear(getByRole('textbox', { name: 'End Date' }));
    userEvent.type(getByRole('textbox', { name: 'End Date' }), '01/01/2010');
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(onSubmit).toBeCalledWith(expected));
  });

  it('Resets dates to the last 30 days on reset click', async () => {
    const expected = {
      satellites: expect.anything(),
      start_date: startOfDay(subDays(new Date(), 30)).toISOString(),
      end_date: endOfDay(new Date()).toISOString(),
    };
    const { getByRole, onSubmit } = renderComponent({
      currentSearch: {
        satellites: ['sat0'],
        start_date: new Date(2000, 0, 3).toISOString(),
        end_date: new Date(2000, 0, 4).toISOString(),
      },
    });
    userEvent.click(getByRole('button', { name: 'Reset' }));
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(onSubmit).toBeCalledWith(expected));
  });

  it('Uses the existing search if available', () => {
    const currentSearch = {
      satellites: ['sat3', 'sat4'],
      start_date: new Date(2000, 0, 0).toISOString(),
      end_date: new Date(2001, 0, 0).toISOString(),
    };
    const { getByRole } = renderComponent({ currentSearch });
    expect(getByRole('checkbox', { name: 'Satellite 3' })).toBeChecked();
    expect(getByRole('checkbox', { name: 'Satellite 4' })).toBeChecked();
    expect(getByRole('textbox', { name: 'Start Date' })).toHaveValue(
      '31/12/1999',
    );
    expect(getByRole('textbox', { name: 'End Date' })).toHaveValue(
      '31/12/2000',
    );
  });

  it('Shows an error and disables the search button if geometry is too large', () => {
    const { getByText, getByRole } = renderComponent({ aoiTooLarge: true });
    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByText('AOI is too large')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it("Disables the search button if there's no aoi drawn", () => {
    const { getByRole } = renderComponent({ aoi: null });
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
    expect(getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('Calls onInfoClick when an info button is clicked', () => {
    const { getAllByRole, onInfoClick } = renderComponent();
    userEvent.click(getAllByRole('button', { name: 'Info' })[0]);
    expect(onInfoClick).toBeCalled();
  });

  it('Shows errors for satellites', async () => {
    const { getByText, getByRole } = renderComponent({ currentSearch: {} });
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() =>
      expect(getByText('Select at least one satellite')).toBeInTheDocument(),
    );
  });

  it('Shows errors for dates', async () => {
    const { getByText, getByRole } = renderComponent({ currentSearch: {} });
    userEvent.click(getByRole('button', { name: 'Search' }));
    await waitFor(() =>
      expect(getByText('Choose an end date')).toBeInTheDocument(),
    );
  });
});
