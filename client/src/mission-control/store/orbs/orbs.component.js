import React from 'react';

import { Link } from 'react-router-dom';

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const Orbs = ({ orbs }) => (
  <ul>
    {orbs.map(orb => (
      <li key={orb.id}>
        <Link to={`/orbs/${orb.id}`}>Learn More</Link>
      </li>
    ))}
  </ul>
);
