import React from 'react';

import { render } from 'test/test-utils';

import { Sidebar } from '.';

describe('Sidebar', () => {
  it('Shows a logo if one is given', () => {
    const { getByText } = render(<Sidebar logo={<div>Logo</div>} />);
    expect(getByText('Logo')).toBeInTheDocument();
  });

  it('Shows a header if one is given', () => {
    const { getByText } = render(<Sidebar header={<div>Header</div>} />);

    expect(getByText('Header')).toBeInTheDocument();
  });

  it('Keeps the logo at the top', () => {
    const { container } = render(
      <Sidebar logo={<div>Logo</div>} header={<div>Header</div>} />,
    );
    expect(container.firstChild.firstChild).toHaveTextContent('Logo');
  });

  it('Shows the footer if one is given', () => {
    const { getByText } = render(<Sidebar footer={<div>Footer</div>} />);
    expect(getByText('Footer')).toBeInTheDocument();
  });

  it('Keeps the footer at the bottom', () => {
    const { container } = render(
      <Sidebar
        logo={<div>Logo</div>}
        header={<div>Header</div>}
        footer={<div>Footer</div>}
      />,
    );
    expect(container.firstChild.lastChild).toHaveTextContent('Footer');
  });
});
