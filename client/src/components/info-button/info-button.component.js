import { InfoIcon } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';
import styles from './info-button.module.css';

/**
 * @param {React.DetailedHTMLProps<
 *   React.ButtonHTMLAttributes<HTMLButtonElement>,
 *   HTMLButtonElement> & {iconClassName?: string}} props
 */
const InfoButton = ({ className, title = 'Info', iconClassName, ...rest }) => (
  <button className={clsx(styles.button, className)} {...rest}>
    <InfoIcon classes={clsx(styles.icon, iconClassName)} title={title} />
  </button>
);

export default InfoButton;
