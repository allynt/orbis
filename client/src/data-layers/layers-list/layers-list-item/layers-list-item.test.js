import React from 'react';
import { render } from '@testing-library/react';
import { LayersListItem } from './layers-list-item.component';
import userEvent from '@testing-library/user-event';

const title = 'Test title';

describe.only('<LayersListItem />', () => {
  it('Shows the name of the layer', () => {
    const { getByText } = render(<LayersListItem title={title} />);
    expect(getByText(title)).toBeInTheDocument();
  });

  it('Shows the drag handle icon', () => {
    const { getByTitle } = render(<LayersListItem title={title} />);
    expect(getByTitle('Drag')).toBeInTheDocument();
  });

  it("Shows the arrow icon if there's child components", () => {
    const { getByTitle } = render(
      <LayersListItem title={title}>
        <div>Test</div>
      </LayersListItem>,
    );
    expect(getByTitle('Expand')).toBeInTheDocument();
  });

  it("Does not show the arrow icon if there aren't child components", () => {
    const { queryByTitle } = render(<LayersListItem title={title} />);
    expect(queryByTitle('Expand')).not.toBeInTheDocument();
  });

  it('Expands on click when collapsed', () => {
    const { getByText } = render(
      <LayersListItem title={title}>
        <div>Child</div>
      </LayersListItem>,
    );
    userEvent.click(getByText(title));
    expect(getByText('Child')).toBeInTheDocument();
  });

  it('Collapses on click when expanded', () => {
    const { getByText, queryByText } = render(
      <LayersListItem title={title}>
        <div>Child</div>
      </LayersListItem>,
    );
    userEvent.click(getByText(title));
    expect(getByText('Child')).toBeInTheDocument();
    userEvent.click(getByText(title));
    expect(queryByText('Child')).not.toBeInTheDocument();
  });
});
