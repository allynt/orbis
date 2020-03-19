import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { formatISO, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';
import ErrorIcon from '@astrosat/astrosat-ui/dist/icons/error-icon';

import validate from './satellite-search-form.validator';

import { setCurrentSearchQuery, searchSatellites } from './satellites.actions';

import { RESULTS, SATELLITE, TIER } from './satellites-panel.component';
import { getGeometryAreaKmSquared } from 'utils/geometry';

import styles from './satellite-search-form.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const DATE_FORMAT = 'yyy-MM-dd';
const DAYS_IN_PAST = 7;

const tiers = [
  {
    id: 'free',
    label: 'Free images',
    description: 'Some text describing the FREE images'
  },
  {
    id: 'mid',
    label: 'Mid-resolution',
    description: 'Some text describing the MID-RES images'
  },
  {
    id: 'high',
    label: 'High-resolution',
    description: 'Some text describing the HIGH-RES images'
  }
];

const CustomDatePicker = React.forwardRef(({ value, onClick }, ref) => (
  <button type="button" className={styles.datePicker} onClick={onClick}>
    {value}
  </button>
));

const collectIds = (formValues, array) =>
  array.reduce((acc, item) => {
    // Check if satellite id exists in values object.
    const key = Object.keys(formValues).find(key => key === item.id);
    if (key && formValues[key]) {
      acc = [...acc, key];
    }
    return acc;
  }, []);

export const savedSearchToFormValues = savedSearch => {
  let formValues = {};
  const properties = ['satellites', 'tiers'];
  for (let property of properties) {
    if (savedSearch[property]) {
      for (let item of savedSearch[property]) {
        formValues[item] = true;
      }
    }
  }
  return formValues;
};

const FormSection = ({ title, children }) => (
  <div className={styles.formSection}>
    <h3>{title}</h3>
    {children}
  </div>
);

const defaults = {
  values: {
    'sentinel-2': true,
    free: true
  }
};

const SatelliteSearchForm = ({ satellites, geometry, setVisiblePanel, setSelectedMoreInfo, toggleMoreInfoDialog }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(subDays(new Date(), DAYS_IN_PAST));
  const [endDate, setEndDate] = useState(new Date());
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);
  const maximumAoiArea = useSelector(state => state.app.config.maximumAoiArea);
  const geometryTooLarge = geometry && getGeometryAreaKmSquared(geometry) > maximumAoiArea;

  const { handleChange, handleSubmit, values, setValues } = useForm(onSubmit, validate, defaults);

  useEffect(() => {
    if (currentSearchQuery) {
      currentSearchQuery.start_date && setStartDate(new Date(currentSearchQuery.start_date));
      currentSearchQuery.end_date && setEndDate(new Date(currentSearchQuery.end_date));
      const convertedSearch = savedSearchToFormValues(currentSearchQuery);
      setValues(convertedSearch);
    }
  }, [currentSearchQuery]);

  function onSubmit() {
    // Collect all selected satellites into one array of satellite ids.
    const selectedSatellitesIds = collectIds(values, satellites);
    // Collect all selected tiers into one array of tier ids.
    const selectedTiersIds = collectIds(values, tiers);

    const query = {
      satellites: selectedSatellitesIds,
      start_date: formatISO(startDate),
      end_date: formatISO(endDate),
      tiers: selectedTiersIds,
      aoi: geometry
    };
    dispatch(setCurrentSearchQuery(query));
    dispatch(searchSatellites(query));
    setVisiblePanel(RESULTS);
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formSections}>
        <FormSection title="Data Source">
          <ul className={styles.checkboxList}>
            {satellites.map(satellite => (
              <li key={satellite.label} className={styles.checkboxListItem}>
                <Checkbox
                  name={satellite.id}
                  label={satellite.label}
                  onChange={handleChange}
                  checked={values[satellite.id] === true}
                />

                <button
                  className={styles.infoButton}
                  type="button"
                  onClick={() => {
                    setSelectedMoreInfo({ type: SATELLITE, data: satellite });
                    toggleMoreInfoDialog();
                  }}
                >
                  <InfoIcon classes={styles.infoIcon} />
                </button>
              </li>
            ))}
          </ul>
        </FormSection>
        <FormSection title="Date">
          <div className={styles.datePickers}>
            <DatePicker
              name="start_date"
              dateFormat={DATE_FORMAT}
              selected={startDate}
              onChange={date => setStartDate(date)}
              customInput={<CustomDatePicker />}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <div className={styles.datePickerDivider} />
            <DatePicker
              name="end_date"
              dateFormat={DATE_FORMAT}
              selected={endDate}
              onChange={date => setEndDate(date)}
              customInput={<CustomDatePicker />}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </FormSection>
        <FormSection title="Resolution">
          <ul className={styles.checkboxList}>
            {tiers.map(tier => (
              <li key={tier.id} className={styles.checkboxListItem}>
                <Checkbox
                  name={tier.id}
                  label={tier.label}
                  onChange={handleChange}
                  checked={values[tier.id] === true}
                />

                <button
                  className={styles.infoButton}
                  type="button"
                  onClick={() => {
                    setSelectedMoreInfo({ type: TIER, data: tier });
                    toggleMoreInfoDialog();
                  }}
                >
                  <InfoIcon classes={styles.infoIcon} />
                </button>
              </li>
            ))}
          </ul>
        </FormSection>
      </div>
      <div className={sideMenuStyles.buttons}>
        {geometryTooLarge && (
          <div className={styles.errorContainerBackground}>
            <div className={styles.errorContainer}>
              <ErrorIcon classes={styles.errorIcon} />
              <p className={styles.errorMessage}>AOI is too large, redraw or zoom in</p>
            </div>
          </div>
        )}
        <Button type="submit" theme="primary" disabled={geometryTooLarge} classNames={[sideMenuStyles.button]}>
          Search
        </Button>
      </div>
    </form>
  );
};

SatelliteSearchForm.propTypes = {};

export default SatelliteSearchForm;
