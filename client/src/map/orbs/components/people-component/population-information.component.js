import * as React from 'react';

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@astrosat/astrosat-ui';

import { toTitleCase } from 'utils/text';

const personTypes = [
  {
    name: 'VOLUNTEER',
    color: '#6cc24a',
  },
  {
    name: 'RECIPIENT',
    color: '#f6e800',
  },
  {
    name: 'GROUP',
    color: '#8031A7',
  },
];

export const PopulationInformation = () => (
  <List>
    {personTypes.map(personType => (
      <ListItem key={personType.name}>
        <ListItemIcon>
          <Box
            width="1rem"
            height="1rem"
            borderRadius="borderRadius"
            style={{
              backgroundColor: personType.color,
            }}
          />
        </ListItemIcon>
        <ListItemText primary={toTitleCase(personType.name)} />
      </ListItem>
    ))}
  </List>
);
