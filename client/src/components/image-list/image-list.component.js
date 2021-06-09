import React from 'react';

import { GridList } from '@astrosat/astrosat-ui';

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
  <GridList>
    {React.Children.map(children, child =>
      React.cloneElement(child, { name, onChange, selectedValue: value }),
    )}
  </GridList>
);
