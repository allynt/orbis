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
    defaultValue: 'dark',
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
  viewport: {
    viewports: {
      sidebar: {
        name: 'Sidebar',
        styles: {
          width: '320px',
          height: '100%',
        },
      },
    },
  },
};
