import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@astrosat/astrosat-ui';
import '../src/normalize.css';
import '../src/reset.css';

addDecorator(storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>);
