import * as React from 'react';

import { makeStyles, Typography } from '@astrosat/astrosat-ui';

import { SidePanelSection } from 'components';

const useStyles = makeStyles(theme => ({
  information: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    columnGap: theme.typography.pxToRem(theme.spacing(1)),
    rowGap: theme.typography.pxToRem(theme.spacing(2)),
  },
  details: {
    gridColumn: '1 / -1',
  },
  sourceLabel: {
    lineHeight: 'normal',
  },
}));

/**
 * @param {{
 *  details?: string
 *  source?: string
 * }} props
 */
export const MoreInformation = ({ details, source }) => {
  const styles = useStyles();
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
            <Typography>{source}</Typography>
          </>
        )}
      </div>
    </SidePanelSection>
  );
};
