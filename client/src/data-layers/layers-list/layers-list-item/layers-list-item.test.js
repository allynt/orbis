import * as React from 'react';

import { render } from '@testing-library/react';

import { LayersListItem } from './layers-list-item.component';

const title = 'Test title';

describe('<LayersListItem />', () => {
  it('Shows the name of the layer', () => {
    const { getByText } = render(<LayersListItem title={title} />);
    expect(getByText(title)).toBeInTheDocument();
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
});
