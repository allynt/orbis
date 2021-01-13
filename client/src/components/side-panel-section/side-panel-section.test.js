import * as React from 'react';

import { render } from '@testing-library/react';

import { SidePanelSection } from './side-panel-section.component';

const title = 'Test title';

describe('<SidePanelSection />', () => {
  it('Shows the name of the layer', () => {
    const { getByText } = render(<SidePanelSection title={title} />);
    expect(getByText(title)).toBeInTheDocument();
  });

  it("Shows the arrow icon if there's child components", () => {
    const { getByTitle } = render(
      <SidePanelSection title={title}>
        <div>Test</div>
      </SidePanelSection>,
    );
    expect(getByTitle('Expand')).toBeInTheDocument();
  });

  it("Does not show the arrow icon if there aren't child components", () => {
    const { queryByTitle } = render(<SidePanelSection title={title} />);
    expect(queryByTitle('Expand')).not.toBeInTheDocument();
  });
});
