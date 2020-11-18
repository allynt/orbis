import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CrowdlessSidebarComponent } from './sidebar.component';

const renderComponent = ({ results = undefined, isLoading = false } = {}) => {
  const onFindClick = jest.fn();
  const utils = render(
    <CrowdlessSidebarComponent
      onFindClick={onFindClick}
      results={results}
      isLoading={isLoading}
    />,
  );
  return { ...utils, onFindClick };
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
});
