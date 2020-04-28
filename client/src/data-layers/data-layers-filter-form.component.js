import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import DatePicker from 'react-datepicker';

import { Checkbox } from '@astrosat/astrosat-ui';

import styles from './data-layers-filter-form.module.css';

const HELPER = 'helper';
const HELPEE = 'helpee';

const HOSPITALS = 'hospitals';
const PHARMACIES = 'pharmacies';
const GP_SURGERIES = 'gp-surgeries';
const CARE_HOME = 'care home';
const NHS = 'nhs';

const DataLayersFilterForm = ({ selectedLayers, onAddLayers, setFiltersPanelVisible }) => {
  const [filteredFeatures, setFilteredFeatures] = useState([]);

  const populationLayer = selectedLayers.find(layer => layer.name === 'population-information');

  const infrastructureLayer = selectedLayers.find(layer => layer.name === 'health-infrastructure');

  function onSubmit(e) {
    e.preventDefault();
    console.log('Filtered Features: ', filteredFeatures);
    // onAddLayers();
  }

  const handleChange = (layer, type) => {
    // Idea 1
    // Grab layer types to be ditched in array of names (hospitals, care-homes)
    // Dispatch to Redux
    // UseMap has Redux state as dependency and re-runs when changed
    // UseMap Has filter to check if the feature matches one in that array,
    // filters out if so (maybe use bool if cannot be done)

    // Idea 2
    // Grab layer types to be kept into array of features
    // OnSubmit, remove layer from map, add new layer of just the filtered
    // features

    const features = layer.data.features;

    const selectedFeatures = features.filter(feature => feature.properties.type === type);

    const flatFeatures = [...filteredFeatures, selectedFeatures].flat();
    setFilteredFeatures(flatFeatures);
    // flatFeatures (terrible name, I know) results in a single array of
    // objects matching the values of the checked boxes
  };

  return ReactDOM.createPortal(
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>SELECT FILTERS: </h1>
        <span onClick={() => setFiltersPanelVisible(false)}>X</span>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.section}>
          <h2>Date: </h2>
          <div>
            <DatePicker name="start_date" selected={new Date()} />
            <p> to </p>
            <DatePicker name="end date" selected={new Date()} />
          </div>
        </div>
        {populationLayer && (
          <div className={styles.section}>
            <h2>Population Filters: </h2>
            <div>
              <Checkbox label="Volunteers" onChange={() => handleChange(populationLayer, HELPER)} />
              <Checkbox label="Recipients" onChange={() => handleChange(populationLayer, HELPEE)} />
            </div>
          </div>
        )}
        {infrastructureLayer && (
          <div className={styles.section}>
            <h2>Infrastructure Filters: </h2>
            <div>
              <Checkbox label="Hospitals" onChange={() => handleChange(infrastructureLayer, HOSPITALS)} />
              <Checkbox label="Pharmacy" onChange={() => handleChange(infrastructureLayer, PHARMACIES)} />
              <Checkbox label="GP Surgery" onChange={() => handleChange(infrastructureLayer, GP_SURGERIES)} />
              <Checkbox label="Care Home" onChange={() => handleChange(infrastructureLayer, CARE_HOME)} />
              <Checkbox label="NHS" onChange={() => handleChange(infrastructureLayer, NHS)} />
            </div>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button className={styles.submitButton} type="submit">
            Apply Filters
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default DataLayersFilterForm;
