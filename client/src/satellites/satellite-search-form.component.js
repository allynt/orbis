import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import { formatISO, subDays } from 'date-fns';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { ReactComponent as InfoIcon } from './info.svg';
import validate from './satellite-search-form.validator';
import { RESULTS } from './satellites-panel.component';
import { searchSatellites, setCurrentSearchQuery } from './satellites.actions';
import styles from './satellite-search-form.module.css';

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
      <div>
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
                  type="button"
                  onClick={() => {
                    console.log('Selected SATELLITE: ', satellite);
                    setSelectedSatelliteMoreInfo({ id: 1, description: 'desc' });
                    toggleSatelliteMoreInfoDialog();
                  }}
                >
                  <InfoIcon />
                </button>
              </li>
            ))}
          </ul>
        </FormSection>
        <FormSection title="Date">
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
        </FormSection>
        <FormSection title="Resolutions">
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
                    type="button"
                    onClick={() => {
                      setSelectedTierMoreInfo({ id: 1, description: 'desc' });
                      toggleTierMoreInfoDialog();
                    }}
                  >
                    <InfoIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        </FormSection>
      </div>

      <div>
        <Button type="submit" theme="primary">
          Search
        </Button>
      </div>
    </form>
  );
};

SatelliteSearchForm.propTypes = {};

export default SatelliteSearchForm;
