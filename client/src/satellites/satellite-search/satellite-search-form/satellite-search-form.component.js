import React, { useState, useEffect } from 'react';

import {
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  useForm,
  Button,
  Divider,
  Well,
  makeStyles,
} from '@astrosat/astrosat-ui/';

import { formatISO, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import { InfoButton } from 'components';
import { getGeometryAreaKmSquared } from 'utils/geometry';

import { RESULTS, SATELLITE, TIER } from '../../satellites-panel.component';
import {
  setCurrentSatelliteSearchQuery,
  fetchSatelliteScenes,
} from '../../satellites.slice';
import validate from './satellite-search-form.validator';

const DATE_FORMAT = 'yyy-MM-dd';
const DAYS_IN_PAST = 7;

const tiers = [
  {
    id: 'free',
    label: 'Free images',
    description: 'Some text describing the FREE images',
  },
  {
    id: 'mid',
    label: 'Mid-resolution',
    description: 'Some text describing the MID-RES images',
  },
  {
    id: 'high',
    label: 'High-resolution',
    description: 'Some text describing the HIGH-RES images',
  },
];

const CustomDatePicker = React.forwardRef(({ value, onClick }, ref) => (
  <button type="button" onClick={onClick}>
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

const defaults = {
  values: {
    'sentinel-2': true,
    free: true,
  },
};

const useStyles = makeStyles(theme => ({
  checkbox: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  divider: { margin: theme.spacing(2, 0) },
  datePickers: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
}));

const SatelliteSearchForm = ({
  satellites,
  geometry,
  setVisiblePanel,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
}) => {
  const dispatch = useDispatch();
  const styles = useStyles({});

  const [startDate, setStartDate] = useState(subDays(new Date(), DAYS_IN_PAST));
  const [endDate, setEndDate] = useState(new Date());
  const currentSearchQuery = useSelector(
    state => state.satellites.currentSearchQuery,
  );
  const maximumAoiArea = useSelector(state => state.app.config.maximumAoiArea);
  const geometryTooLarge =
    geometry && getGeometryAreaKmSquared(geometry) > maximumAoiArea;

  const { handleChange, handleSubmit, values, setValues } = useForm(
    onSubmit,
    validate,
    null,
    defaults,
  );

  useEffect(() => {
    if (currentSearchQuery) {
      currentSearchQuery.start_date &&
        setStartDate(new Date(currentSearchQuery.start_date));
      currentSearchQuery.end_date &&
        setEndDate(new Date(currentSearchQuery.end_date));
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
      aoi: geometry,
    };
    dispatch(setCurrentSatelliteSearchQuery(query));
    dispatch(fetchSatelliteScenes(query));
    setVisiblePanel(RESULTS);
  }
  return (
    <form onSubmit={handleSubmit}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Satellite Image Source</FormLabel>
        <FormGroup>
          {satellites?.map(satellite => (
            <div key={satellite.id} className={styles.checkbox}>
              <FormControlLabel
                name={satellite.id}
                onChange={handleChange}
                checked={values[satellite.id] === true}
                label={satellite.label}
                control={<Checkbox />}
              />
              <InfoButton
                onClick={() => {
                  setSelectedMoreInfo({
                    type: SATELLITE,
                    data: satellite,
                  });
                  toggleMoreInfoDialog();
                }}
              />
            </div>
          ))}
        </FormGroup>
      </FormControl>
      <Divider className={styles.divider} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Date</FormLabel>
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
      </FormControl>
      <Divider className={styles.divider} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Resolution</FormLabel>
        <FormGroup>
          {tiers.map(tier => (
            <div key={tier.id} className={styles.checkbox}>
              <FormControlLabel
                name={tier.id}
                onChange={handleChange}
                checked={values[tier.id] === true}
                label={tier.label}
                control={<Checkbox />}
              />
              <InfoButton
                onClick={() => {
                  setSelectedMoreInfo({ type: TIER, data: tier });
                  toggleMoreInfoDialog();
                }}
              />
            </div>
          ))}
        </FormGroup>
      </FormControl>
      <>
        {geometryTooLarge && (
          <Well severity="error">AOI is too large, redraw or zoom in</Well>
        )}
      </>
      <Button type="submit" disabled={geometryTooLarge}>
        Search
      </Button>
    </form>
  );
};

export default SatelliteSearchForm;
