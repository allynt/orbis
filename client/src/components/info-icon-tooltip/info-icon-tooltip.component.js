import { InfoIcon } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './info-icon-tooltip.module.css';

/**
 * @param {{
 *  children?: React.ReactNode
 *  name?: string
 *  className?: string
 *  place?: import('react-tooltip').Place
 * }} props
 */
export const InfoIconTooltip = ({
  children,
  name,
  className,
  place = 'right',
}) => (
  <div className={clsx(styles.info, className)}>
    <div
      data-tip
      data-for={name ? `${name}-tooltip` : 'tooltip'}
      role="tooltip"
      className={styles.infoButton}
      aria-label="tooltip"
      data-scroll-hide="false"
    >
      <InfoIcon classes={styles.infoIcon} />
    </div>
    <ReactTooltip
      className={styles.tooltip}
      id={name ? `${name}-tooltip` : 'tooltip'}
      place={place}
      effect="solid"
      arrowColor="var(--color-primary)"
      backgroundColor="var(--color-primary)"
      textColor="var(--color--text--dark)"
    >
      {children}
    </ReactTooltip>
  </div>
);
