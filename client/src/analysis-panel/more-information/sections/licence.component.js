import React from 'react';
import { SectionLabel, SectionValue } from './styles';

/**
 * @param {{
 *   licence: import('typings/orbis').SourceMetadata['licence']
 * }} props
 */
export const Licence = ({ licence }) => (
  <>
    <SectionLabel>Licence:</SectionLabel>
    <SectionValue>{licence}</SectionValue>
  </>
);
