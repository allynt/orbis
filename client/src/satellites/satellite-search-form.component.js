import React, { useState, useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { formatISO, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import { searchSatellites, setCurrentSearchQuery } from './satellites.actions';
import validate from './satellite-search-form.validator';

import { ReactComponent as InfoIcon } from './info.svg';
import { RESULTS } from './satellites-panel.component';

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

const SatelliteSearchForm = ({
  satellites,
  geometry,
  selectedSatelliteSearch,
  setVisiblePanel,
  setSelectedSatelliteMoreInfo,
  toggleSatelliteMoreInfoDialog,
  setSelectedTierMoreInfo,
  toggleTierMoreInfoDialog
}) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(subDays(new Date(), DAYS_IN_PAST));
  const [endDate, setEndDate] = useState(new Date());

  const { handleChange, handleSubmit, values, setValues } = useForm(onSubmit, validate, defaults);

  useEffect(() => {
    if (selectedSatelliteSearch) {
      selectedSatelliteSearch.start_date && setStartDate(new Date(selectedSatelliteSearch.start_date));
      selectedSatelliteSearch.end_date && setEndDate(new Date(selectedSatelliteSearch.end_date));
      const convertedSearch = savedSearchToFormValues(selectedSatelliteSearch);
      setValues(convertedSearch);
    }
  }, [selectedSatelliteSearch]);

  function onSubmit() {
    // Collect all selected satellites into one array of satellite ids.
    const selectedSatellites = collectIds(values, satellites);
    // Collect all selected tiers into one array of tier ids.
    const selectedTiers = collectIds(values, tiers);

    const query = {
      satellites: selectedSatellites,
      start_date: formatISO(startDate),
      end_date: formatISO(endDate),
      tiers: selectedTiers,
      geometry
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
                    console.log('Selected SATELLITE: ', satellite);
                    setSelectedSatelliteMoreInfo({ id: 1, description: 'desc' });
                    toggleSatelliteMoreInfoDialog();
                  }}
                >
                  <InfoIcon className={styles.infoIcon} />
                </button>
              </li>
            ))}
          </ul>
        </FormSection>
        <FormSection title="Date">
          <div className={styles.datePickers}>
            <DatePicker
              name="startDate"
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
              name="endDate"
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
            {tiers.map(tier => {
              return (
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
                      setSelectedTierMoreInfo({ id: 1, description: 'desc' });
                      toggleTierMoreInfoDialog();
                    }}
                  >
                    <InfoIcon className={styles.infoIcon} />
                  </button>
                </li>
              );
            })}
          </ul>
        </FormSection>
      </div>
      <div className={sideMenuStyles.buttons}>
        <Button classNames={[sideMenuStyles.button]} type="submit" theme="primary">
          Search
        </Button>
      </div>
    </form>
  );
};

SatelliteSearchForm.propTypes = {};

export default SatelliteSearchForm;
