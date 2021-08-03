import React from 'react';

import {
  List,
  ListItem,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@astrosat/astrosat-ui';

const FirstCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
}));

/**
 * @param {{
 *  satellite: import('typings').Satellite
 * }} props
 */
export const SatelliteInfoTable = ({ satellite }) => (
  <Table>
    <TableBody>
      <TableRow>
        <FirstCell>Name: </FirstCell>
        <TableCell>{satellite.label || 'not currently available'}</TableCell>
      </TableRow>
      <TableRow>
        <FirstCell>Description: </FirstCell>
        <TableCell>
          {satellite.description || 'not currently available'}
        </TableCell>
      </TableRow>
      <TableRow>
        <FirstCell>Available visualisations: </FirstCell>
        <TableCell>
          <List dense disablePadding>
            {satellite.visualisations.map(vis => (
              <ListItem key={vis.id} disableGutters>
                {vis.label || 'not currently available'}
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

/**
 * @param {{
 *  scene: import('typings').Scene}} props
 */
export const SceneInfoTable = ({ scene }) => (
  <Table>
    <TableBody>
      {Object.keys(scene.metadata).map(key => (
        <TableRow key={key}>
          <FirstCell>{key}</FirstCell>
          <TableCell>
            {`${scene.metadata[key]}` || 'not currently available'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
