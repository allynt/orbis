import React from 'react';
import { Button } from '@astrosat/astrosat-ui';
import { LoadingSpinner } from './loading-spinner.component';

export default { title: 'Components/LoadingSpinner' };

export const Spins = () => <LoadingSpinner />;

export const InAButton = () => (
  <Button>
    <LoadingSpinner />
  </Button>
);
