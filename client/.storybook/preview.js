import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@astrosat/astrosat-ui';
import '../src/normalize.css';
import '../src/reset.css';

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'dark',
        value: '#333f48',
      },
      {
        name: 'light',
        value: '#f8f8f8',
      },
    ],
  },
};

addDecorator(storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>);
