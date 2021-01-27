import * as React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  TriangleIcon,
  Typography,
} from '@astrosat/astrosat-ui';
import { InfoButtonTooltip } from 'components/info-button-tooltip/info-button-tooltip.component';

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
    alignItems: 'center',
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
});

const useStyles = makeStyles(theme => ({
  fakeSummary: {
    cursor: 'default !important',
  },
  icon: {
    width: '0.875rem',
    height: '0.875rem',
  },
  info: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * @param {{
 *  children?: React.ReactNode
 *  title: string
 *  defaultExpanded?: boolean
 *  info?: React.ReactNode
 * }} props
 */
export const SidePanelSection = ({
  children,
  title,
  defaultExpanded = false,
  info,
}) => {
  const accordionClasses = useAccordionStyles();
  const summaryClasses = useSummaryClasses();
  const styles = useStyles();

  const Info = info && (
    <InfoButtonTooltip
      iconButtonClassName={styles.info}
      placement="right"
      tooltipContent={info}
    />
  );

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
        {Info}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  ) : (
    <Typography
      className={styles.fakeSummary}
      variant="h4"
      component={AccordionSummary}
      role="presentation"
    >
      {title}
      {Info}
    </Typography>
  );
};
