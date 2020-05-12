import React from 'react';
import PropTypes from 'prop-types';

// import styles from './infrastructure-detail.module.css';
import infoStyles from './info-details.module.css';

const PK = 'pk';
const PERSON_TYPE = 'person_type';
const OBJECT = 'object';
const NO_DATA = 'Not available';

const mapObject = data => {
  const feature = JSON.parse(data);
  return Object.keys(feature)
    .filter(key => key !== PK && key !== PERSON_TYPE)
    .map(key => {
      if (typeof feature[key] === OBJECT) {
        // When value is object, make new table inside li and map out values
        // Parent is ul, so must return li
        return (
          <li>
            <ul className={infoStyles.table}>
              <h1 className={infoStyles.listTitle}>{key}</h1>
              {mapObject(feature[key])}
            </ul>
          </li>
        );
      } else {
        //when value is not object, render li to browser
        return (
          <li key={key} className={infoStyles.listItem2}>
            <span className={infoStyles.label}>{typeof key === 'number' ? key + 1 : key}: </span>
            <span className={infoStyles.content}>{feature[key] || NO_DATA}</span>
          </li>
        );
      }
    });
};

const InfrastructureDetail = ({ features }) => {
  console.log('Features: ', features);
  return (
    <>
      <h1 className={infoStyles.header}>User Details</h1>
      <div className={infoStyles.modal}>
        {features.map(feature => (
          <div key={feature.id}>
            <ul className={infoStyles.list}>{mapObject(feature.properties)}</ul>
          </div>
        ))}
      </div>
    </>
  );
};

InfrastructureDetail.propTypes = {
  features: PropTypes.array.isRequired,
};

export default InfrastructureDetail;
