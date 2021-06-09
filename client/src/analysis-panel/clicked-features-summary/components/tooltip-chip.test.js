import React from 'react';

import { render } from '@testing-library/react';

import { TooltipChip } from './tooltip-chip.component';

describe('<TooltipChip />', () => {
  it('Has a tooltip for long area names', () => {
    const long = "This is a long name, oh my it's so long, like good grief";
    const { getByRole } = render(
      <TooltipChip
        feature={{
          object: {
            properties: {
              area_name: long,
            },
          },
        }}
      />,
    );
    expect(getByRole('tooltip', { name: long })).toBeInTheDocument();
  });

  it("Shows the full name an no tooltip when there's only one feature", () => {
    const long = 'Highlands and Islands';
    const { queryByRole } = render(
      <TooltipChip
        isOnlyFeature
        feature={{
          object: {
            properties: {
              area_name: long,
            },
          },
        }}
      />,
    );
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
