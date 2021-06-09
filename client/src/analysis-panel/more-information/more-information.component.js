import * as React from 'react';

import { styled } from '@astrosat/astrosat-ui';

import { get } from 'lodash';

import { SidePanelSection } from 'components';

import { Details, Licence, Source, Sources } from './sections';

const Content = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  columnGap: theme.spacing(1),
  rowGap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

/**
 * @param {{
 *  currentSource: import('typings/orbis').Source
 *  selectedProperty: import('typings/orbis').Property
 * }} props
 */
export const MoreInformation = ({ currentSource, selectedProperty }) => {
  const details = get(selectedProperty, 'details'),
    source = get(selectedProperty, 'source'),
    licence = get(currentSource, ['metadata', 'licence']),
    sources = get(currentSource, ['metadata', 'provenance', 'sources']);

  return (
    <SidePanelSection title="More Information" defaultExpanded>
      <Content>
        {details && <Details details={details} />}
        {source && <Source source={source} />}
        {sources && <Sources sources={sources} />}
        {licence && <Licence licence={licence} />}
      </Content>
    </SidePanelSection>
  );
};
