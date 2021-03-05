import * as React from 'react';

import {
  makeStyles,
  Typography,
  Link,
  List,
  ListItem,
} from '@astrosat/astrosat-ui';

import { SidePanelSection } from 'components';
import { get, isObject } from 'lodash';
import { isUrl } from 'utils/text';

const useStyles = makeStyles(theme => ({
  information: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  details: {
    gridColumn: '1 / -1',
  },
  label: {
    lineHeight: 'normal',
  },
  value: {
    wordBreak: 'break-word',
    gridColumn: '2 / -1',
  },
  listItem: {
    '&:first-of-type': {
      paddingTop: 0,
    },
  },
}));

const LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

/**
 * @param {{
 *  currentSource: import('typings/orbis').Source
 *  selectedProperty: import('typings/orbis').Property
 * }} props
 */
export const MoreInformation = ({ currentSource, selectedProperty }) => {
  const styles = useStyles();
  const details = get(selectedProperty, 'details'),
    source = get(selectedProperty, 'source'),
    licence = get(currentSource, ['metadata', 'licence']),
    sources = get(currentSource, ['metadata', 'provenance', 'sources']);

  return (
    <SidePanelSection title="More Information" defaultExpanded>
      <div className={styles.information}>
        {details && (
          <Typography className={styles.details}>{details}</Typography>
        )}
        {source && (
          <>
            <Typography variant="h4" component="p" className={styles.label}>
              Source:
            </Typography>
            <Typography className={styles.value}>{source}</Typography>
          </>
        )}
        {sources && (
          <>
            <Typography variant="h4" component="p" className={styles.label}>
              Links:
            </Typography>
            <List className={styles.value} dense disablePadding>
              {sources.map((source, i) => {
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
                if (isUrl(source))
                  content = (
                    <Link {...LINK_PROPS} href={source}>
                      {source}
                    </Link>
                  );
                return (
                  <ListItem
                    key={`${itemKey}`}
                    className={styles.listItem}
                    disableGutters
                  >
                    {content}
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
        {licence && (
          <>
            <Typography variant="h4" component="p" className={styles.label}>
              Licence:
            </Typography>
            <Typography className={styles.value}>{licence}</Typography>
          </>
        )}
      </div>
    </SidePanelSection>
  );
};
