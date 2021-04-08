import { Grid } from '@material-ui/core';
import React from 'react';

/**
 * @template T
 * @param {{
 *   onChange: (value: T) => void
 *   value?: T
 *   name?: string
 *   children: React.ReactNode
 * }} props
 */
export const ImageList = ({ children, value, name, onChange }) => (
  <Grid container spacing={2} component="ul">
    {React.Children.map(children, child =>
      React.cloneElement(child, { name, onChange, selectedValue: value }),
    )}
  </Grid>
);
