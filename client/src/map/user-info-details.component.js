import React from 'react';
import PropTypes from 'prop-types';

import styles from './user-info-details.module.css';

const PK = 'pk';
const CREATED = 'created';

const UserInfoDetail = ({ features }) => (
  <>
    <h1 className={styles.header}>User Details</h1>
    <div className={styles.modal}>
      {features.map(feature => (
        <div key={feature.id}>
          <ul className={styles.list}>
            {Object.keys(feature.properties)
              .filter(key => key !== PK && key !== CREATED)
              .map(key => (
                <li key={key}>
                  <span className={styles.label}>{key}: </span>
                  <span>{feature.properties[key]}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  </>
);

UserInfoDetail.propTypes = {
  features: PropTypes.array.isRequired
};

export default UserInfoDetail;
