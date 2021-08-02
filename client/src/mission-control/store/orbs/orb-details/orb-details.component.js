import React from 'react';

import { Link, Typography } from '@astrosat/astrosat-ui';

import { find } from 'lodash';
import { Link as RouterLink, useParams } from 'react-router-dom';

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const OrbDetails = ({ orbs }) => {
  /** @type {{id: string}} */
  const { id } = useParams();
  const orb = find(orbs, { id: +id });

  if (!orb) return null;

  return (
    <>
      <RouterLink to="/orbs">
        <Link>Back</Link>
      </RouterLink>
      <Typography variant="h1">{orb.name}</Typography>
      <Typography>{orb.description}</Typography>
      <img src={orb.images[0]} alt={`${orb.name} Example`} />
    </>
  );
};
