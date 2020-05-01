import React from 'react';
import PropTypes from 'prop-types';

// import styles from './infrastructure-detail.module.css';
import infoStyles from './info-details.module.css';

const NO_DATA = 'No data available';

const InfrastructureDetail = ({ features }) => (
  <>
    <h1 className={infoStyles.header}>Infrastructure Details</h1>
    <div className={infoStyles.modal}>
      {features &&
        features.map(feature => (
          <ul key={feature.id} className={infoStyles.list}>
            <li className={infoStyles.label}>
              {feature.properties.name && feature.properties.name !== 'null' ? feature.properties.name : NO_DATA}
            </li>
            <li>
              {feature.properties.address1 && feature.properties.address1 !== 'null'
                ? feature.properties.address1
                : NO_DATA}
            </li>
            <li>
              {feature.properties.address2 && feature.properties.address2 !== 'null' ? feature.properties.address2 : ''}
            </li>
            <li>
              {feature.properties.postcode && feature.properties.postcode !== 'null'
                ? feature.properties.postcode
                : NO_DATA}
            </li>
            <li>
              <span className={infoStyles.label}>Phone Number: </span>
              <span className={infoStyles.content}>
                {feature.properties.phone_number && feature.properties.phone_number !== 'null'
                  ? feature.properties.phone_number
                  : NO_DATA}
              </span>
            </li>
          </ul>
        ))}
    </div>
  </>
);

InfrastructureDetail.propTypes = {
  features: PropTypes.array.isRequired,
};

export default InfrastructureDetail;
