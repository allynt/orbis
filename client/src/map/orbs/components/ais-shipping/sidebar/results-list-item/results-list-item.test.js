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
    const result = { properties: { 'Vessel Name': 'Test Ship' } };
    const { getByText } = renderComponent({ result });
    expect(getByText(result.properties['Vessel Name'])).toBeInTheDocument();
  });

  it('Shows the vessel call sign', () => {
    const result = { properties: { 'Vessel Call Sign': 'Test Call Sign' } };
    const { getByText } = renderComponent({ result });
    expect(
      getByText(result.properties['Vessel Call Sign']),
    ).toBeInTheDocument();
  });

  it('Shows the vessel destination', () => {
    const result = { properties: { 'Vessel Destination': 'Test Destination' } };
    const { getByText } = renderComponent({ result });
    expect(
      getByText(result.properties['Vessel Destination']),
    ).toBeInTheDocument();
  });

  it('Shows a skeleton if loading', () => {
    const { getAllByRole } = renderComponent({ isLoading: true });
    expect(getAllByRole('progressbar')).toHaveLength(2);
  });

  it('Calls on click with the feature when clicked', () => {
    const result = { id: '123', properties: { 'Vessel Name': 'Test Ship' } };
    const { onClick, getByRole } = renderComponent({
      result,
    });
    userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(result);
  });
});
