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
});
