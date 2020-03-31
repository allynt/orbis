import React from 'react';
import PropTypes from 'prop-types';

import styles from './user-info-details.module.css';

const UserInfoDetail = ({ features }) => (
  <>
    {features.map(feature => (
      <ul key={feature.properties.name} className={styles.list}>
        <li>
          <span className={styles.label}>Name:</span>
          <span>{feature.properties.name}</span>
        </li>
        <li>
          <span className={styles.label}>Status:</span>
          <span>{feature.properties.person_type}</span>
        </li>
        <li>
          <span className={styles.label}>Age:</span>
          <span>{feature.properties.age}</span>
        </li>
        <li>
          <span className={styles.label}>Postcode:</span>
          <span>{feature.properties.postcode}</span>
        </li>
        <li>
          <span className={styles.label}>Phone:</span>
          <span>{feature.properties.phone_number}</span>
        </li>
        <li>
          <span className={styles.label}>Email:</span>
          <span>{feature.properties.email_address}</span>
        </li>
      </ul>
    ))}
  </>
);

UserInfoDetail.propTypes = {
  features: PropTypes.array.isRequired
};

export default UserInfoDetail;
