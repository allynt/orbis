import React from 'react';
import { ThemeProvider, CssBaseline } from '@astrosat/astrosat-ui';

export const decorators = [
  (Story, context) => (
    <ThemeProvider theme={context.globals.theme}>
      <CssBaseline />
      <Story {...context} />
    </ThemeProvider>
  ),
];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light', left: '☀️' },
        { value: 'dark', title: 'Dark', left: '🌒' },
      ],
    },
  },
};

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
      {
        name: 'yellow',
        value: '#f6be00',
      },
    ],
  },
};
