// @ts-nocheck
import * as React from 'react';
import { render } from '@testing-library/react';
import { MoreInformation } from './more-information.component';

describe('<MoreInformation />', () => {
  it('Shows the details of the property', () => {
    const { getByText } = render(
      <MoreInformation selectedProperty={{ details: 'Hello' }} />,
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Shows the source of the property', () => {
    const { getByText } = render(
      <MoreInformation selectedProperty={{ source: 'Hello' }} />,
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Shows the licence for the source', () => {
    const { getByText } = render(
      <MoreInformation currentSource={{ metadata: { licence: "driver's" } }} />,
    );
    expect(getByText("driver's")).toBeInTheDocument();
  });

  it('Shows each provenance.sources source text', () => {
    const currentSource = {
      metadata: {
        provenance: { sources: ['source 1', 'source 2', 'source 3'] },
      },
    };
    const { getByText } = render(
      <MoreInformation currentSource={currentSource} />,
    );
    currentSource.metadata.provenance.sources.forEach(source =>
      expect(getByText(source)).toBeInTheDocument(),
    );
  });

  it("Shows a source as a link if it's a link", () => {
    const currentSource = {
      metadata: {
        provenance: {
          sources: ['source 1', 'http://test.com', 'https://test.com'],
        },
      },
    };
    const { getByText, getByRole } = render(
      <MoreInformation currentSource={currentSource} />,
    );
    expect(getByText('source 1')).toBeInTheDocument();
    expect(getByRole('link', { name: 'http://test.com' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'https://test.com' })).toBeInTheDocument();
  });

  it("Shows a link source with specific text if it's an object", () => {
    const currentSource = {
      metadata: {
        provenance: {
          sources: [{ text: 'This is a link', src: 'http://test.com' }],
        },
      },
    };
    const { getByRole } = render(
      <MoreInformation currentSource={currentSource} />,
    );
    expect(getByRole('link', { name: 'This is a link' })).toHaveAttribute(
      'href',
      'http://test.com',
    );
  });
});
