import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
const dateFormat = 'd MMM yyy';

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

const defaults = {
  values: {
    'sentinel-2': true,
    free: true
  }
};

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

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate, defaults);

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
      startDate: formatISO(startDate),
      endDate: formatISO(endDate),
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
                  disabled={satellite.id !== 'sentinel-2'}
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
              dateFormat={dateFormat}
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
              dateFormat={dateFormat}
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
                  <Checkbox
                    name={tier.id}
                    label={tier.label}
                    onChange={handleChange}
                    checked={values[tier.id]}
                    disabled={tier.id !== 'free'}
                  />

                  <button
                    // onBlur={() => dispatch({ type: SET_IS_INFO_VISIBLE, payload: false })}
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
