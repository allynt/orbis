import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ResultsListItem from './results-list-item.component';

const renderComponent = ({ result = undefined, isLoading = false }) => {
  const onClick = jest.fn();
  const utils = render(
    <ResultsListItem result={result} isLoading={isLoading} onClick={onClick} />,
  );
  return { ...utils, onClick };
};

describe('<ResultsListItem />', () => {
  it('Shows the development ID as Heading', () => {
    const result = { properties: { 'Project ID': 'Test ID' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties['Project ID'])).toBeInTheDocument();
  });

  it('Shows the Address and Postcode strapline', () => {
    const result = {
      properties: { Address: '1 Test Address', Postcode: 'EH7 5QG' },
    };
    const { getByText } = renderComponent({ result });
    expect(
      getByText('Address: ' + result.properties['Address']),
    ).toBeInTheDocument();
  });

  it('Shows a skeleton if loading', () => {
    const { getAllByRole } = renderComponent({ isLoading: true });
    expect(getAllByRole('progressbar')).toHaveLength(2);
  });

  it('Calls on click with the feature when clicked', () => {
    const result = { id: '123', properties: { 'Project ID': 'Test ID' } };
    const { onClick, getByRole } = renderComponent({
      result,
    });
    userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(result);
  });
});
