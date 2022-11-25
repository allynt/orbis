import * as React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles({
  section: {
    display: 'grid',
    gridTemplateRows: 'max-content max-content max-content 1fr max-content',
    width: '60%',
  },
  left: {
    borderTopLeftRadius: '1rem',
    borderBottomLeftRadius: '1rem',
  },
  right: {
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
  },
});

/**
 * @param {{
 *   orientation?: 'left' | 'right'
 * } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} props
 */
export const Section = ({ className, orientation = 'left', ...rest }) => {
  const styles = useStyles({ orientation });
  return (
    <div
      className={clsx(className, styles.section, styles[orientation])}
      {...rest}
    />
  );
};
