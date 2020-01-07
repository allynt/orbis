import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import styles from './toolbar.module.css';

const ToolbarItem = ({ item, onClick, selected }) => {
  return (
    <>
      <div
        className={`${styles.item} ${selected ? styles.active : ''}`}
        onClick={onClick}
        data-tip
        data-for={item.label}
      >
        {item.icon}
      </div>
      <ReactTooltip id={item.label}>
        <span>{item.tooltip}</span>
      </ReactTooltip>
    </>
  );
};

const Toolbar = ({ items }) => {
  const [selected, setSelected] = useState(null);

  const select = item => {
    setSelected(item);
    item.action();
  };
  return (
    <div className={styles.toolbar}>
      <OrbisLogo className={styles.logo} />
      <div className={styles.topPanel}>
        {items
          .filter(item => !item.footer)
          .map(item => {
            return (
              <ToolbarItem
                key={item.label}
                item={item}
                onClick={() => select(item)}
                selected={selected && selected.label === item.label}
              />
            );
          })}
      </div>
      <div className={styles.bottomPanel}>
        {items
          .filter(item => item.footer)
          .map(item => {
            return (
              <ToolbarItem
                key={item.label}
                item={item}
                onClick={() => select(item)}
                selected={selected && selected.label === item.label}
              />
            );
          })}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  items: PropTypes.array.isRequired
};

export default Toolbar;
