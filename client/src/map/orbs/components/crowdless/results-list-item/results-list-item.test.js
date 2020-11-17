import { render } from '@testing-library/react';
import * as React from 'react';
import ResultsListItem from './results-list-item.component';

const renderComponent = ({ result }) =>
  render(<ResultsListItem result={result} />);

describe('<ResultsListItem />', () => {
  // it.each(['not busy', 'busy', 'very busy'])(
  //   'Shows the %s icon for a result',
  //   category => {
  //     const result = { properties: { crowdednessCategory: category } };
  //     const { getByTitle } = renderComponent({ result });
  //     expect(getByTitle(category)).toBeInTheDocument();
  //   },
  // );

  it.todo('Shows the result name');

  it.todo('Shows the result address');

  it.todo('Shows all results as highlighted when no result is selected');

  it.todo('Shows the selected result as highlighted');

  it.todo('Calls the click handler with the clicked result');
});
