import * as React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  TriangleIcon,
  Typography,
} from '@astrosat/astrosat-ui';

const useAccordionStyles = makeStyles({
  root: {
    overflowX: 'hidden',
    background: 'none',
    boxShadow: 'none',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
});

const useSummaryClasses = makeStyles({
  root: {
    '&$expanded': {
      minHeight: 8 * 6,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
});

const useStyles = makeStyles({
  fakeSummary: {
    cursor: 'default !important',
  },
  icon: {
    width: '0.875rem',
    height: '0.875rem',
  },
});

/**
 * @param {{
 *  children?: React.ReactNode
 *  title: string
 *  defaultExpanded?: boolean
 * }} props
 */
export const LayersListItem = ({
  children,
  title,
  defaultExpanded = false,
}) => {
  const accordionClasses = useAccordionStyles();
  const summaryClasses = useSummaryClasses();
  const styles = useStyles();

  return !!children ? (
    <Accordion classes={accordionClasses} defaultExpanded={defaultExpanded}>
      <AccordionSummary
        classes={summaryClasses}
        expandIcon={
          <TriangleIcon titleAccess="Expand" className={styles.icon} />
        }
      >
        <Typography variant="h4" component="span">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  ) : (
    <Typography
      className={styles.fakeSummary}
      variant="h4"
      component={AccordionSummary}
    >
      {title}
    </Typography>
  );
};
