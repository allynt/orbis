import React from 'react';
import PropTypes from 'prop-types';

import infoStyles from './info-details.module.css';

const OBJECT = 'object';
const STRING = 'string';
const BRACE = '{';
const BRACKET = '[';
const NULL = 'null';

const PK = 'pk';
const PERSON_TYPE = 'person_type';
const NO_DATA = 'Not available';

const mapObject = data => {
  // FIXME: Once https://github.com/mapbox/mapbox-gl-js/issues/9678#issuecomment-627456271 is resolved, we should no longer need this.
  let feature = null;
  if (data) {
    feature = Object.keys(data).reduce((acc, key) => {
      acc[key] =
        typeof data[key] === STRING &&
        (data[key].startsWith(BRACE) || data[key].startsWith(BRACKET))
          ? JSON.parse(data[key])
          : data[key];

      return acc;
    }, {});
  }

  return (
    feature &&
    Object.keys(feature)
      .filter(key => key !== PK && key !== PERSON_TYPE)
      .map((key, i) => {
        // Parent is always ul, so must always return li
        if (Array.isArray(feature[key])) {
          // When value is array, render li to browser in array-specific structure
          return (
            <li key={i} className={infoStyles.listItem}>
              <ul className={infoStyles.table}>
                <h2 className={infoStyles.label}>{key}: </h2>
                {feature[key].length > 0 ? (
                  feature[key].map((value, i) => (
                    <li
                      key={i}
                      className={`${infoStyles.content} ${infoStyles.listItem}`}
                    >
                      {value}
                    </li>
                  ))
                ) : (
                  <li
                    key={i}
                    className={`${infoStyles.content} ${infoStyles.listItem}`}
                  >
                    {NO_DATA}
                  </li>
                )}
              </ul>
            </li>
          );
        } else if (typeof feature[key] === OBJECT) {
          // When value is object, make new table inside li and map out values
          return (
            <li key={key} className={infoStyles.groupedListItem}>
              <ul className={infoStyles.table}>
                <h1 className={infoStyles.listTitle}>{key}</h1>
                {mapObject(feature[key])}
              </ul>
            </li>
          );
        } else {
          //when value is not object or array, parse null values and render li to browser
          const value =
            feature[key] === NULL ? JSON.parse(feature[key]) : feature[key];
          return (
            <li key={key} className={infoStyles.listItem}>
              <span className={infoStyles.label}>{key}: </span>
              <span className={infoStyles.content}>{value || NO_DATA}</span>
            </li>
          );
        }
      })
  );
};

const FeatureDetail = ({ features }) => {
  const title = features?.[0]?.properties?.Type
    ? 'User Details'
    : 'Infrastructure Details';
  return (
    <>
      <h1 className={infoStyles.header}>{title}</h1>
      <div className={infoStyles.modal}>
        {features?.map(feature => (
          <ul key={feature.id} className={infoStyles.list}>
            {mapObject(feature.properties)}
          </ul>
        ))}
      </div>
    </>
  );
};

FeatureDetail.propTypes = {
  features: PropTypes.array.isRequired,
};

export default FeatureDetail;
