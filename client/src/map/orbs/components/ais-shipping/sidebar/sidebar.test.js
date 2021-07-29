import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AisShippingSidebarComponent } from './sidebar.component';

const RESULTS = [
  {
    id: 1,
    properties: {
      'Vessel Name': 'Lollipop',
      'Vessel Type': 'Pleasure/Leisure',
      Flag: 'United States of America',
    },
  },
  {
    id: 2,
    properties: {
      'Vessel Name': 'The Black Pearl',
      'Vessel Type': 'Pirate',
      Flag: 'Barbados',
    },
  },
];

const renderComponent = ({
  results = RESULTS,
  isLoading = false,
  visible = true,
  selectedResult = undefined,
  pages = 1,
} = {}) => {
  const onFindClick = jest.fn();
  const onPageClick = jest.fn();
  const onRadioChange = jest.fn();
  const utils = render(
    <AisShippingSidebarComponent
      visible={visible}
      onFindClick={onFindClick}
      pages={pages}
      onPageClick={onPageClick}
      onRadioChange={onRadioChange}
      results={results}
      isLoading={isLoading}
      selectedResult={selectedResult}
    />,
  );
  return { ...utils, onFindClick, onPageClick, onRadioChange };
};

describe('<AisShippingSidebarComponent />', () => {
  it('Calls onFindClick when the find button is clicked', () => {
    const { getByRole, onFindClick } = renderComponent();
    userEvent.click(getByRole('button', { name: /request\sdata/i }));
    expect(onFindClick).toHaveBeenCalled();
  });

  it('Shows the results if there are any', () => {
    const { getByText } = renderComponent();

    expect(getByText('List of Vessels')).toBeInTheDocument();

    RESULTS.forEach(result => {
      expect(getByText(result.properties['Vessel Name'])).toBeInTheDocument();
      expect(
        getByText('Type: ' + result.properties['Vessel Type']),
      ).toBeInTheDocument();
      expect(
        getByText('Flag: ' + result.properties['Flag']),
      ).toBeInTheDocument();
    });
  });

  it('Shows a loading spinner in the button if loading', () => {
    const { getByTestId } = renderComponent({ isLoading: true });
    expect(getByTestId('button-progress')).toBeInTheDocument();
  });

  it("Shows a skeleton results list if loading and there aren't already results", () => {
    const { getAllByRole } = renderComponent({
      isLoading: true,
      results: null,
    });
    expect(getAllByRole('progressbar').length).toBeGreaterThanOrEqual(1);
  });

  it("Doesn't show anything if not loading, no results", () => {
    const { queryByText } = renderComponent({
      results: null,
    });
    expect(queryByText('List of Vessels')).not.toBeInTheDocument();
  });

  it('calls onRadioChange when the radio is clicked', () => {
    const { getByRole, onRadioChange } = renderComponent();
    userEvent.click(getByRole('radio'));
    expect(onRadioChange).toHaveBeenCalled();
  });

  it('hides the button and results when not visible', () => {
    const { queryByRole } = renderComponent({ visible: false });
    expect(
      queryByRole('button', { name: 'Request Data' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('list')).not.toBeInTheDocument();
  });

  it("shows items as active if there's no active result", () => {
    const { getAllByRole } = renderComponent();
    const [, ...items] = getAllByRole('listitem');
    items.forEach(element => expect(element).toHaveClass('Mui-selected'));
  });

  it('shows the active result as active', () => {
    const { getByRole } = renderComponent({
      selectedResult: { id: 1 },
    });
    expect(
      getByRole('button', {
        name: /Lollipop/i,
      }),
    ).toHaveClass('Mui-selected');
    expect(getByRole('button', { name: /The\sBlack\sPearl/i })).not.toHaveClass(
      'selected',
    );
  });

  it('Does not show pagination if pages <= 1', () => {
    const { queryByRole } = renderComponent();
    expect(queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });

  it('Shows pagination if pages > 1', () => {
    const { getByRole } = renderComponent({
      pages: 3,
    });
    expect(getByRole('button', { name: 'page 1' })).toBeInTheDocument();
  });

  it('Calls onPageClick with the page number when a number button is clicked', () => {
    const { getByRole, onPageClick } = renderComponent({
      pages: 3,
    });
    userEvent.click(getByRole('button', { name: 'Go to page 2' }));
    expect(onPageClick).toHaveBeenCalledWith(2);
  });
});
