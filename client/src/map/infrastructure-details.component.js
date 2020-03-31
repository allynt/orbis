import React from 'react';
import PropTypes from 'prop-types';

import parseISO from 'date-fns/parseISO';
import formatDate from '../utils/dates';

import styles from './infrastructure-detail.module.css';

const InfrastructureDetail = ({ feature }) => (
  <ul className={styles.list}>
    <li>{feature.properties.name}</li>
    <li>{feature.properties.address1}</li>
    <li>{feature.properties.address2}</li>
    <li>{feature.properties.postcode}</li>
    <li>{feature.properties.phone_number}</li>
  </ul>
);

InfrastructureDetail.propTypes = {
  feature: PropTypes.object.isRequired
};

export default InfrastructureDetail;
