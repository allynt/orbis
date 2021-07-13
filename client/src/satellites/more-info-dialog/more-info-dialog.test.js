import React from 'react';

import { render } from '@testing-library/react';

import { InfoType } from 'satellites/satellite.constants';

import { MoreInfoDialog } from './more-info-dialog.component';

describe('<MoreInfoDialog />', () => {
  it.each`
    type                  | data                                            | testString
    ${InfoType.SATELLITE} | ${{ label: 'Test string', visualisations: [] }} | ${'Available visualisations:'}
    ${InfoType.SCENE}     | ${{ metadata: { Hello: 'Test' } }}              | ${'Hello'}
    ${InfoType.TIER}      | ${{ label: 'Hello', description: 'Desc' }}      | ${'Tier:'}
  `(`Shows $type info when type is $type`, ({ testString, ...rest }) => {
    const { getByText } = render(<MoreInfoDialog open {...rest} />);
    expect(getByText(testString)).toBeInTheDocument();
  });
});
