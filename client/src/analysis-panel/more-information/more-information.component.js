import * as React from 'react';

import { makeStyles, Typography } from '@astrosat/astrosat-ui';

import { SidePanelSection } from 'components';

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
  sourceLabel: {
    lineHeight: 'normal',
  },
  sourceValue: {
    wordBreak: 'break-word',
  },
}));

/**
 * @param {{
 *  currentSource: import('typings/orbis').Source
 *  selectedProperty: import('typings/orbis').Property
 * }} props
 */
export const MoreInformation = ({ currentSource, selectedProperty }) => {
  const styles = useStyles();
  const { details, source } = selectedProperty;
  return (
    <SidePanelSection title="More Information" defaultExpanded>
      <div className={styles.information}>
        {details && (
          <Typography className={styles.details}>{details}</Typography>
        )}
        {source && (
          <>
            <Typography
              variant="h4"
              component="p"
              className={styles.sourceLabel}
            >
              Source:
            </Typography>
            <Typography className={styles.sourceValue}>{source}</Typography>
          </>
        )}
      </div>
    </SidePanelSection>
  );
};
