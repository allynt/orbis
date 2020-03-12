import React, { useState, useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { subDays, formatISO } from 'date-fns';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import validate from './satellite-search-form.validator';

import { setCurrentSearchQuery, searchSatellites } from './satellites.actions';

import { RESULTS } from './satellites-panel.component';

import { ReactComponent as InfoIcon } from './info.svg';

import styles from './search.module.css';
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

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button type="button" className={styles.picker} onClick={onClick}>
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
  const defaults = useRef({
    values: {
      'sentinel-2': true,
      free: true
    }
  });

  useEffect(() => {
    if (selectedSatelliteSearch) {
      selectedSatelliteSearch?.start_date && setStartDate(new Date(selectedSatelliteSearch.start_date));
      selectedSatelliteSearch?.end_date && setEndDate(new Date(selectedSatelliteSearch.end_date));
      const convertedSearch = savedSearchToFormValues(selectedSatelliteSearch);
      defaults.current = { values: convertedSearch };
    }
  }, [selectedSatelliteSearch]);

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate, defaults.current);

  function onSubmit() {
    console.log(values);

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
    <form onSubmit={handleSubmit}>
      <div className={styles.filters}>
        <div>
          <h3>SEARCH</h3>

          <ul className={styles.satellites}>
            {satellites.map(satellite => (
              <li key={satellite.label} className={styles.satellite}>
                <Checkbox
                  name={satellite.id}
                  label={satellite.label}
                  onChange={handleChange}
                  checked={values[satellite.id]}
                />

                <button
                  type="button"
                  onClick={() => {
                    console.log('Selected SATELLITE: ', satellite);
                    setSelectedSatelliteMoreInfo({ id: 1, description: 'desc' });
                    toggleSatelliteMoreInfoDialog();
                  }}
                >
                  <InfoIcon className={styles.icon} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>TIME RANGE</h3>

          <div className={styles.options}>
            <DatePicker
              name="startDate"
              dateFormat={DATE_FORMAT}
              selected={startDate}
              onChange={date => setStartDate(date)}
              customInput={<CustomInput />}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <span> to </span>
            <DatePicker
              name="endDate"
              dateFormat={DATE_FORMAT}
              selected={endDate}
              onChange={date => setEndDate(date)}
              customInput={<CustomInput />}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </div>

        <div>
          <h3>RESOLUTIONS</h3>

          <ul className={styles.tiers}>
            {tiers.map(tier => {
              return (
                <li className={styles.tier} key={tier.id}>
                  <Checkbox name={tier.id} label={tier.label} onChange={handleChange} checked={values[tier.id]} />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTierMoreInfo({ id: 1, description: 'desc' });
                      toggleTierMoreInfoDialog();
                    }}
                  >
                    <InfoIcon className={styles.icon} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
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
