import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import style from './toolbar.module.css';

// import { Button } from '@astrosat/astrosat-ui';

const Toolbar = ({ items }) => {
  return (
    <div className={style.toolbar}>
      {items.map(item => {
        const icon = item.icon;
        return (
          <div key={item.label}>
            <button onClick={() => item.action()} className={style.toolbarBtn} data-tip data-for={item.label}>
              {icon}
            </button>

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
