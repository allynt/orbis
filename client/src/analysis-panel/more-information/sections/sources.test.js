import React from 'react';

import { render } from '@testing-library/react';

import { Sources } from './sources.component';

describe('<Sources />', () => {
  it('Shows each provenance.sources source text', () => {
    const sources = ['source 1', 'source 2', 'source 3'];
    const { getByText } = render(<Sources sources={sources} />);
    sources.forEach(source => expect(getByText(source)).toBeInTheDocument());
  });

  it("Shows a source as a link if it's a link", () => {
    const sources = ['source 1', 'http://test.com', 'https://test.com'];
    const { getByText, getByRole } = render(<Sources sources={sources} />);
    expect(getByText('source 1')).toBeInTheDocument();
    expect(getByRole('link', { name: 'http://test.com' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'https://test.com' })).toBeInTheDocument();
  });

  it("Shows a link source with specific text if it's an object", () => {
    const sources = [{ text: 'This is a link', src: 'http://test.com' }];
    const { getByRole } = render(<Sources sources={sources} />);
    expect(getByRole('link', { name: 'This is a link' })).toHaveAttribute(
      'href',
      'http://test.com',
    );
  });

  it('Can handle a mix', () => {
    const sources = [
      'source 1',
      'http://test.com',
      { text: 'This is a link', src: 'http://fake.com' },
    ];
    const { getByText, getByRole } = render(<Sources sources={sources} />);
    expect(getByText('source 1')).toBeInTheDocument();
    expect(getByRole('link', { name: 'http://test.com' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'This is a link' })).toHaveAttribute(
      'href',
      'http://fake.com',
    );
  });
});
