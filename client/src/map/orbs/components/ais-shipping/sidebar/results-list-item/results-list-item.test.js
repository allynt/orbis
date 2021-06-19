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
  it('Shows the vessel name', () => {
    const result = { properties: { 'Vessel Name': 'Lollipop' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties['Vessel Name'])).toBeInTheDocument();
  });

  it('Shows the vessel type', () => {
    const result = { properties: { 'Vessel Type': 'Pleasure/Leisure' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties['Vessel Type'])).toBeInTheDocument();
  });

  it('Shows the vessel flag', () => {
    const result = { properties: { Flag: 'United States of America' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties['Flag'])).toBeInTheDocument();
  });

  it('Shows a skeleton if loading', () => {
    const { getAllByRole } = renderComponent({ isLoading: true });
    expect(getAllByRole('progressbar')).toHaveLength(2);
  });

  it('Calls on click with the feature when clicked', () => {
    const result = { id: '123', properties: { 'Vessel Name': 'Lollipop' } };
    const { onClick, getByRole } = renderComponent({
      result,
    });
    userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(result);
  });
});
