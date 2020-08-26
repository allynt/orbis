import React from 'react';
import * as Icons from './icons';
import { Checkbox } from '@astrosat/astrosat-ui';

/** @type {{
 *   Icon: React.FunctionComponent,
 *   name: string
 * }[]}
 */
const CATEGORIES = [
  {
    name: 'PPE',
    Icon: Icons.PPE,
  },
  {
    name: 'Cleaning and Domestic',
    Icon: Icons.Cleaning,
  },
  { name: 'Medical Equipment and Aids', Icon: Icons.Medical },
  { name: 'Foods', Icon: Icons.Food },
  { name: 'Stationary', Icon: Icons.Stationery },
  { name: 'Clothing', Icon: Icons.Clothing },
  { name: 'Services', Icon: Icons.Services },
  { name: 'Staffing', Icon: Icons.Staffing },
  { name: 'Miscellaneous', Icon: Icons.Other },
];

export const CheckboxFilters = () => (
  <>
    {CATEGORIES.map(({ name, Icon }) => (
      <Checkbox
        key={name}
        id={name}
        defaultChecked
        label={
          <span>
            <Icon title={name} />
            {name}
          </span>
        }
      />
    ))}
  </>
);
