import * as React from 'react';

import { render } from '@testing-library/react';

import { default as CrowdlessMapComponent } from './map.component';

describe('<CrowdlessMapComponent />', () => {
  it('Shows the crowdedness score', () => {
    const crowdednessScore = 7357;
    const { getByText } = render(
      <CrowdlessMapComponent feature={{ properties: { crowdednessScore } }} />,
    );
    expect(getByText(new RegExp(`${crowdednessScore}`))).toBeInTheDocument();
  });

  it('Shows the place name', () => {
    const name = 'Test Name';
    const { getByText } = render(
      <CrowdlessMapComponent feature={{ properties: { name } }} />,
    );
    expect(getByText(name)).toBeInTheDocument();
  });
  it('Shows the place address', () => {
    const address = '1 Test Street';
    const { getByText } = render(
      <CrowdlessMapComponent feature={{ properties: { address } }} />,
    );
    expect(getByText(address)).toBeInTheDocument();
  });
});
