import React from 'react';
import PropTypes from 'prop-types';

import parseISO from 'date-fns/parseISO';
import formatDate from '../utils/dates';

import styles from './infrastructure-detail.module.css';

const InfrastructureDetail = ({ feature }) => {
  const properties = feature.properties;
  console.log('Properties: ', properties);
  return (
    <ul className={styles.list}>
      <li className={styles.name}>{properties.name}</li>
      <li>{properties.address1}</li>
      <li>{properties.address2}</li>
      <li>{properties.postcode}</li>
      <li>
        <span className={styles.label}>Phone Number: </span>
        <span>{properties.phone_number}</span>
      </li>
    </ul>
  );
};

InfrastructureDetail.propTypes = {
  feature: PropTypes.object.isRequired
};

export default InfrastructureDetail;
