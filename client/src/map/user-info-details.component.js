import React from 'react';
import PropTypes from 'prop-types';

import styles from './user-info-details.module.css';

const PK = 'pk';
const CREATED = 'created';

const UserInfoDetail = ({ features }) => {
  return (
    <>
      <h1 className={styles.header}>User Details</h1>
      <div className={styles.modal}>
        {features.map(feature => {
          const properties = feature.properties;
          return (
            <div key={feature.id}>
              <ul className={styles.list}>
                {Object.keys(properties)
                  .filter(key => key !== PK && key !== CREATED)
                  .map(key => {
                    return (
                      <li key={key}>
                        <span className={styles.label}>{key}: </span>
                        <span>{properties[key]}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

UserInfoDetail.propTypes = {
  features: PropTypes.array.isRequired
};

export default UserInfoDetail;
