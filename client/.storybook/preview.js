import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@astrosat/astrosat-ui';

addDecorator(storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>);
