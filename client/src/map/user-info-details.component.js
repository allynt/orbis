import React from 'react';
import PropTypes from 'prop-types';

import styles from './user-info-details.module.css';
import infoStyles from './info-details.module.css';

const PK = 'pk';
const CREATED = 'created';

const UserInfoDetail = ({ features }) => (
  <>
    <h1 className={infoStyles.header}>User Details</h1>
    <div className={infoStyles.modal}>
      {features.map(feature => (
        <div key={feature.id}>
          <ul className={infoStyles.list}>
            {Object.keys(feature.properties)
              .filter(key => key !== PK && key !== CREATED)
              .map(key => (
                <li key={key}>
                  <span className={infoStyles.label}>{key}: </span>
                  <span className={infoStyles.content}>{feature.properties[key]}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  </>
);

UserInfoDetail.propTypes = {
  features: PropTypes.array.isRequired,
};

export default UserInfoDetail;
