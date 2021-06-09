import * as React from 'react';

import { render } from '@testing-library/react';

import { SidePanel } from './side-panel.component';

describe('<SidePanel />', () => {
  it('shows header content if provided', () => {
    const { getByText } = render(<SidePanel header="Hello" open />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('shows child content', () => {
    const { getByText } = render(<SidePanel>Hello</SidePanel>);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
