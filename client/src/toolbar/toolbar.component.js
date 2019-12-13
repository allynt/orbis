import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import styles from './toolbar.module.css';

const Toolbar = ({ items }) => {
  return (
    <div className={styles.toolbar}>
      {items.map(item => {
        const icon = item.icon;
        return (
          <div className={styles.buttonWrapper} key={item.label}>
            <Button onClick={() => item.action()} className={styles.toolbarBtn} data-tip data-for={item.label}>
              {icon}
            </Button>

            <ReactTooltip id={item.label}>
              <span>{item.tooltip}</span>
            </ReactTooltip>
          </div>
        );
      })}
    </div>
  );
};

Toolbar.propTypes = {
  items: PropTypes.array.isRequired
};

export default Toolbar;
