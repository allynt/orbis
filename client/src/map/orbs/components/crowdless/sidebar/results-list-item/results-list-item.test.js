import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import ResultsListItem from './results-list-item.component';

const renderComponent = ({ result = undefined, isLoading = false }) => {
  const onClick = jest.fn();
  const utils = render(
    <ResultsListItem result={result} isLoading={isLoading} onClick={onClick} />,
  );
  return { ...utils, onClick };
};

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
    const { getAllByRole } = renderComponent({ isLoading: true });
    expect(getAllByRole('progressbar')).toHaveLength(3);
  });

  it('Calls on click with the feature when clicked', () => {
    const result = { properties: { placeID: '123' } };
    const { onClick, getByRole } = renderComponent({
      result,
    });
    userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(result);
  });
});
