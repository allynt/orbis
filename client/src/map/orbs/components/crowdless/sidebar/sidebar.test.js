import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CrowdlessSidebarComponent } from './sidebar.component';

const renderComponent = ({
  results = undefined,
  isLoading = false,
  visible = true,
  selectedResult = undefined,
} = {}) => {
  const onFindClick = jest.fn();
  const onRadioChange = jest.fn();
  const utils = render(
    <CrowdlessSidebarComponent
      visible={visible}
      onFindClick={onFindClick}
      onRadioChange={onRadioChange}
      results={results}
      isLoading={isLoading}
      selectedResult={selectedResult}
    />,
  );
  return { ...utils, onFindClick, onRadioChange };
};

describe('<CrowdlessSidebarComponent />', () => {
  it('Calls onFindClick when the find button is clicked', () => {
    const { getByRole, onFindClick } = renderComponent();
    userEvent.click(getByRole('button', { name: /find/i }));
    expect(onFindClick).toHaveBeenCalled();
  });

  it('Shows the results if there are any', () => {
    const results = [
      { properties: { name: 'Tesco', address: '1 Test Street' } },
      { properties: { name: 'Sainsburys', address: '2 Fake Road' } },
    ];
    const { getByText } = renderComponent({ results });
    results.forEach(result => {
      expect(getByText(result.properties.name)).toBeInTheDocument();
      expect(getByText(result.properties.address)).toBeInTheDocument();
    });
  });

  it('Shows a loading spinner in the button if loading', () => {
    const { getByRole } = renderComponent({ isLoading: true });
    expect(getByRole('alert')).toBeInTheDocument();
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
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(queryByRole('list')).not.toBeInTheDocument();
  });
  it("shows items as active if there's no active result", () => {
    const results = [
      { properties: { name: 'Tesco', address: '1 Test Street' } },
      { properties: { name: 'Sainsburys', address: '2 Fake Road' } },
    ];
    const { getAllByRole } = renderComponent({ results });
    getAllByRole('listitem').forEach(element =>
      expect(element).toHaveClass('selected'),
    );
  });

  it('shows the active result as active', () => {
    const results = [
      { properties: { name: 'Tesco', address: '1 Test Street', placeId: 0 } },
      {
        properties: {
          name: 'Sainsburys',
          address: '2 Fake Road',
          placeId: 1,
        },
      },
    ];
    const { getByText } = renderComponent({
      results,
      selectedResult: { properties: { placeId: 0 } },
    });
    expect(getByText('Tesco').parentElement).toHaveClass('selected');
    expect(getByText('Sainsburys').parentElement).not.toHaveClass('selected');
  });
});
