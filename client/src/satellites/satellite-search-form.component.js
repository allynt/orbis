import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { subDays, formatISO } from 'date-fns';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';

import validate from './satellite-search-form.validator';

import { setCurrentSearchQuery, searchSatellites } from './satellites.actions';

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

const defaults = {
  values: {
    'sentinel-2': true,
    free: true
  }
};

const FormSection = ({ title, children }) => (
  <div className={styles.formSection}>
    <h3>{title}</h3>
    {children}
  </div>
);

const SatelliteSearchForm = ({
  satellites,
  geometry,
  setVisiblePanel,
  setSelectedSatelliteMoreInfo,
  toggleSatelliteMoreInfoDialog,
  setSelectedTierMoreInfo,
  toggleTierMoreInfoDialog
}) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(subDays(new Date(), DAYS_IN_PAST));
  const [endDate, setEndDate] = useState(new Date());

  const { handleChange, handleSubmit, values } = useForm(onSubmit, validate, defaults);

  function onSubmit() {
    // Collect all selected satellites into one array of satellite ids.
    const selectedSatellites = satellites.reduce((acc, satellite) => {
      // Check if satellite id exists in values object.
      const key = Object.keys(values).find(key => key === satellite.id);
      if (key && values[key]) {
        acc = [...acc, key];
      }
      return acc;
    }, []);

    // Collect all selected tiers into one array of tier ids.
    const selectedTiers = tiers.reduce((acc, tier) => {
      // Check if tier id exists in values object.
      const key = Object.keys(values).find(key => key === tier.id);
      if (key && values[key]) {
        acc = [...acc, key];
      }
      return acc;
    }, []);

    const query = {
      satellites: selectedSatellites,
      start_date: formatISO(startDate),
      end_date: formatISO(endDate),
      tiers: selectedTiers,
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
                  checked={values[satellite.id]}
                  disabled={satellite.id !== 'sentinel-2'}
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
            {tiers.map(tier => {
              return (
                <li key={tier.id} className={styles.checkboxListItem}>
                  <Checkbox
                    name={tier.id}
                    label={tier.label}
                    onChange={handleChange}
                    checked={values[tier.id]}
                    disabled={tier.id !== 'free'}
                  />

                  <button
                    className={styles.infoButton}
                    type="button"
                    onClick={() => {
                      setSelectedTierMoreInfo({ id: 1, description: 'desc' });
                      toggleTierMoreInfoDialog();
                    }}
                  >
                    <InfoIcon classes={styles.infoIcon} />
                  </button>
                </li>
              );
            })}
          </ul>
        </FormSection>
      </div>

      <div className={sideMenuStyles.buttons}>
        <Button type="submit" theme="primary" classNames={[sideMenuStyles.button]}>
          Search
        </Button>
      </div>
    </form>
  );
};

SatelliteSearchForm.propTypes = {};

export default SatelliteSearchForm;
