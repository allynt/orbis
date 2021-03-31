// @ts-nocheck
import * as React from 'react';
import { render } from '@testing-library/react';
import { MoreInformation } from './more-information.component';

describe('<MoreInformation />', () => {
  it('Shows details if present', () => {
    const { getByText } = render(
      <MoreInformation selectedProperty={{ details: 'Hello' }} />,
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Shows source if present', () => {
    const { getByText } = render(
      <MoreInformation selectedProperty={{ source: 'Hello' }} />,
    );
    expect(getByText('Source:')).toBeInTheDocument();
  });

  it('Shows sources if present', () => {
    const { getByText } = render(
      <MoreInformation
        currentSource={{
          metadata: {
            provenance: {
              sources: ['Hello'],
            },
          },
        }}
      />,
    );
    expect(getByText('Links:')).toBeInTheDocument();
  });

  it('Shows licence if present', () => {
    const { getByText } = render(
      <MoreInformation currentSource={{ metadata: { licence: "driver's" } }} />,
    );
    expect(getByText('Licence:')).toBeInTheDocument();
  });
});
