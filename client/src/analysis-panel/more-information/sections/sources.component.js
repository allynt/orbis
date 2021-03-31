import {
  Link,
  List,
  ListItem as ListItemBase,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';
import { isObject } from 'lodash';
import React from 'react';
import { isUrl } from 'utils/text';
import { SectionLabel, SectionValue } from './styles';

const LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const ListItem = styled(ListItemBase)({
  '&:first-of-type': {
    paddingTop: 0,
  },
});

/**
 * @param {{
 *  sources: import('typings/orbis').SourceMetadata['provenance']['sources']
 * }} props
 */
export const Sources = ({ sources }) => (
  <>
    <SectionLabel>Links:</SectionLabel>
    <SectionValue component={List} dense disablePadding>
      {sources.map(source => {
        let itemKey = source;
        let content = <Typography>{source}</Typography>;
        if (isObject(source)) {
          content = (
            <Link {...LINK_PROPS} href={source.src}>
              {source.text}
            </Link>
          );
          itemKey = source.src;
        }
        if (isUrl(/** @type {string} */ (source)))
          content = (
            <Link {...LINK_PROPS} href={source}>
              {source}
            </Link>
          );
        return (
          <ListItem key={`${itemKey}`} disableGutters>
            {content}
          </ListItem>
        );
      })}
    </SectionValue>
  </>
);
