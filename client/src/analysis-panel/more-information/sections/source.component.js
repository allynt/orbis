import React from 'react';

import { SectionLabel, SectionValue } from './styles';

/**
 * @param {{
 *  source: import('typings').Property['source']
 * }} props
 */
export const Source = ({ source }) => (
  <>
    <SectionLabel>Source:</SectionLabel>
    <SectionValue>{source}</SectionValue>
  </>
);
