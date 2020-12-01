import * as React from 'react';
import { InfoIconTooltip } from './info-icon-tooltip.component';

export default { title: 'components/InfoIconTooltip' };

export const Default = () => <InfoIconTooltip />;

export const Multiple = () => (
  <>
    <InfoIconTooltip />
    <InfoIconTooltip />
  </>
);

export const WithChildren = () => (
  <InfoIconTooltip>
    <p>Hello there</p>
    <p>General Kenobi</p>
  </InfoIconTooltip>
);
