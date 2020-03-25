import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';

import useAuthorization from '../hooks/useAuthorization';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import styles from './toolbar.module.css';

const ToolbarItem = ({ user, item, onClick, selected }) => {
  const isAuthorized = useAuthorization(user, item.roles);

  return (
    isAuthorized && (
      <>
        <div
          className={`${styles.item} ${selected ? styles.active : ''}`}
          onClick={onClick}
          data-tip
          data-for={item.label}
          data-testid={`toolbar-item-${item.label}`}
        >
          {item.icon}
        </div>
        <ReactTooltip id={item.label}>
          <span>{item.tooltip}</span>
        </ReactTooltip>
      </>
    )
  );
};

const Toolbar = ({ user, items }) => {
  const [selected, setSelected] = useState(null);
  const [redirect, setRedirect] = useState(null);

  const select = item => {
    setSelected(item);
    item.action();
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    user && (
      <div className={styles.toolbar}>
        <OrbisLogo className={styles.logo} onClick={() => setRedirect('/')} />
        <div className={styles.topPanel}>
          {items
            .filter(item => !item.footer)
            .map(item => (
              <ToolbarItem
                user={user}
                key={item.label}
                item={item}
                onClick={() => select(item)}
                selected={selected && selected.label === item.label}
              />
            ))}
        </div>
        <div className={styles.bottomPanel}>
          {items
            .filter(item => item.footer)
            .map(item => (
              <ToolbarItem
                user={user}
                key={item.label}
                item={item}
                onClick={() => select(item)}
                selected={selected && selected.label === item.label}
              />
            ))}
        </div>
      </div>
    )
  );
};

Toolbar.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Toolbar;
