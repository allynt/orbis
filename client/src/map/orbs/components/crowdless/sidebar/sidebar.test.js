import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CrowdlessSidebarComponent } from './sidebar.component';

const RESULTS = [
  { properties: { name: 'Tesco', address: '1 Test Street', placeId: 0 } },
  {
    properties: {
      name: 'Sainsburys',
      address: '2 Fake Road',
      placeId: 1,
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
    <CrowdlessSidebarComponent
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

describe('<CrowdlessSidebarComponent />', () => {
  it('Calls onFindClick when the find button is clicked', () => {
    const { getByRole, onFindClick } = renderComponent();
    userEvent.click(getByRole('button', { name: /find/i }));
    expect(onFindClick).toHaveBeenCalled();
  });

  it('Shows the results if there are any', () => {
    const { getByText } = renderComponent();
    RESULTS.forEach(result => {
      expect(getByText(result.properties.name)).toBeInTheDocument();
      expect(getByText(result.properties.address)).toBeInTheDocument();
    });
  });

  it('Shows a loading spinner in the button if loading', () => {
    const { getByTestId } = renderComponent({ isLoading: true });
    expect(getByTestId('button-progress')).toBeInTheDocument();
  });

  it("Shows a skeleton results list if loading and there aren't already results", () => {
    const { getAllByRole } = renderComponent({ isLoading: true });
    expect(getAllByRole('progressbar').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onRadioChange when the radio is clicked', () => {
    const { getByRole, onRadioChange } = renderComponent();
    userEvent.click(getByRole('radio'));
    expect(onRadioChange).toHaveBeenCalled();
  });

  it('hides the button and results when not visible', () => {
    const { queryByRole } = renderComponent({ visible: false });
    expect(
      queryByRole('button', { name: 'Find Supermarkets' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('list')).not.toBeInTheDocument();
  });
  it("shows items as active if there's no active result", () => {
    const { getAllByRole } = renderComponent();
    const [_, ...items] = getAllByRole('listitem');
    items.forEach(element => expect(element).toHaveClass('Mui-selected'));
  });

  it('shows the active result as active', () => {
    const { getByRole } = renderComponent({
      selectedResult: { properties: { placeId: 0 } },
    });
    expect(getByRole('button', { name: /tesco/i })).toHaveClass('Mui-selected');
    expect(getByRole('button', { name: /sainsburys/i })).not.toHaveClass(
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
