import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  dots: { display: 'flex', gap: '1em' },
  dot: {
    width: '0.75em',
    aspectRatio: '1',
    backgroundColor: theme.palette.action.disabled,
    borderRadius: '50%',
    '&$active': {
      backgroundColor: theme.palette.action.active,
    },
  },
  active: {},
}));

const Dots = ({ count = 3, activeIndex = 0, className = '' }) => {
  const styles = useStyles();
  return (
    <div className={clsx(styles.dots, className)}>
      {Array(count)
        .fill(undefined)
        .map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`dot-${i}`}
            className={clsx(styles.dot, { [styles.active]: i === activeIndex })}
          />
        ))}
    </div>
  );
};

export { Dots };
