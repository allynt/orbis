import { render } from '@testing-library/react';
import * as React from 'react';
import ResultsListItem from './results-list-item.component';

const renderComponent = ({ result }) =>
  render(<ResultsListItem result={result} />);

describe('<ResultsListItem />', () => {
  it.each(['not busy', 'busy', 'very busy'])(
    'Shows the %s icon for a result',
    category => {
      const result = { properties: { crowdednessCategory: category } };
      const { getByTitle } = renderComponent({ result });
      expect(getByTitle(category)).toBeInTheDocument();
    },
  );

  it('Shows the result name', () => {
    const result = { properties: { name: 'Test Shop' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties.name)).toBeInTheDocument();
  });

  it('Shows the result address', () => {
    const result = { properties: { address: '1 Test Street' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties.address)).toBeInTheDocument();
  });

  it('Shows a skeleton if loading', () => {
    const { getByRole } = renderComponent({ isLoading: true });
    expect(getByRole('progressbar')).toBeInTheDocument();
  });
});
