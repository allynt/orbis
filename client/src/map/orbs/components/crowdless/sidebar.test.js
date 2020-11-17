import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CrowdlessSidebarComponent } from './sidebar.component';

const renderComponent = ({ results = undefined } = {}) => {
  const onFindClick = jest.fn();
  const utils = render(
    <CrowdlessSidebarComponent onFindClick={onFindClick} results={results} />,
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
});
