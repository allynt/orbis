import React from 'react';
import clsx from 'clsx';
import styles from './info-box.module.css';

/**
 * @param {{
 *   arrow?: 'top' | 'right' | 'bottom' | 'left'
 *   children?: React.ReactNode
 *   className?: string
 *   style?: React.CSSProperties
 * }} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
const InfoBox = ({ arrow, children, className, style }, ref) => (
  <div
    ref={ref}
    className={clsx([
      styles.infoBox,
      {
        [styles.arrow]: !!arrow,
        [styles[arrow]]: !!arrow,
      },
      className,
    ])}
    style={style}
  >
    {children}
  </div>
);

export default React.forwardRef(InfoBox);
