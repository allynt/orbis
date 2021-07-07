import React, { useEffect } from 'react';

import {
  Checkbox as AuiCheckbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
  Well,
  makeStyles,
} from '@astrosat/astrosat-ui/';

import { subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';

import { InfoButton } from 'components';

import { SATELLITE, TIER } from '../../satellites.component';

const DATE_FORMAT = 'yyy-MM-dd';
const DAYS_IN_PAST = 7;

const TIERS = [
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

const Checkbox = ({ name, control, label, onInfoClick }) => {
  const styles = useStyles();
  return (
    <div className={styles.checkbox}>
      <Controller
        name={name}
        control={control}
        render={props => (
          <FormControlLabel
            checked={props.value}
            onChange={(_event, checked) => props.onChange(checked)}
            label={label}
            control={<AuiCheckbox />}
          />
        )}
      />
      <InfoButton onClick={onInfoClick} />
    </div>
  );
};

/**
 * @param {{[key: string]: any}} obj
 */
const keyArrayForTruthyObjectValues = obj =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value) return [...acc, key];
    return acc;
  }, []);

/**
 * @param {{id: string}[]} array
 * @param {string[]} searchArray
 */
const boolObjectForIdArray = (array, searchArray) =>
  array?.reduce(
    (acc, object) => ({
      ...acc,
      [object.id]: searchArray?.includes(object.id),
    }),
    {},
  );

/**
 * @param {import('typings/satellites').SavedSearch} search
 * @param {import('typings/satellites').Satellite[]} satellites
 */
const transformSearchToFormValues = (search, satellites) => ({
  satellites: boolObjectForIdArray(satellites, search?.satellites),
  tiers: boolObjectForIdArray(TIERS, search?.tiers),
  start_date: search?.start_date
    ? new Date(search.start_date)
    : subDays(new Date(), DAYS_IN_PAST),
  end_date: search?.end_date ? new Date(search.end_date) : new Date(),
});

const CustomDatePicker = React.forwardRef(({ value, onClick }, ref) => (
  <button type="button" onClick={onClick}>
    {value}
  </button>
));

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

/**
 * @param {{
 * satellites: import('typings/satellites').Satellite[],
 * aoiTooLarge?: boolean
 * currentSearch?: Partial<import('typings/satellites').SavedSearch>
 * onSubmit: (search: Pick<
 *                      import('typings/satellites').SavedSearch,
 *                      'satellites' | 'start_date' | 'end_date' | 'tiers'
 *                    >) => void
 * onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SatelliteSearchForm = ({
  satellites,
  aoiTooLarge = false,
  currentSearch = { satellites: ['sentinel-2'], tiers: ['free'] },
  onSubmit: onSubmitProp,
  onInfoClick,
}) => {
  const styles = useStyles({});

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: transformSearchToFormValues(currentSearch, satellites),
  });

  useEffect(() => {
    const formValues = transformSearchToFormValues(currentSearch, satellites);
    Object.entries(formValues).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [currentSearch, satellites, setValue]);

  const onSubmit = values => {
    const query = {
      satellites: keyArrayForTruthyObjectValues(values.satellites),
      tiers: keyArrayForTruthyObjectValues(values.tiers),
      start_date: values.start_date.toISOString(),
      end_date: values.end_date.toISOString(),
    };
    onSubmitProp(query);
  };

  const handleInfoClick = info => () => {
    onInfoClick(info);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Satellite Image Source</FormLabel>
        <FormGroup>
          {satellites?.map(satellite => (
            <Checkbox
              key={satellite.id}
              name={`satellites.${satellite.id}`}
              control={control}
              label={satellite.label}
              onInfoClick={handleInfoClick({
                type: SATELLITE,
                data: satellite,
              })}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Divider className={styles.divider} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Date</FormLabel>
        <div className={styles.datePickers}>
          <Controller
            name="start_date"
            control={control}
            render={props => (
              <DatePicker
                dateFormat={DATE_FORMAT}
                selected={props.value}
                onChange={props.onChange}
                customInput={<CustomDatePicker />}
                selectsStart
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            render={props => (
              <DatePicker
                dateFormat={DATE_FORMAT}
                selected={props.value}
                onChange={props.onChange}
                customInput={<CustomDatePicker />}
                selectsEnd
              />
            )}
          />
        </div>
      </FormControl>
      <Divider className={styles.divider} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Resolution</FormLabel>
        <FormGroup>
          {TIERS.map(tier => (
            <Checkbox
              key={tier.id}
              name={`tiers.${tier.id}`}
              control={control}
              label={tier.label}
              onInfoClick={handleInfoClick({ type: TIER, data: tier })}
            />
          ))}
        </FormGroup>
      </FormControl>
      <>
        {aoiTooLarge && (
          <Well severity="error">AOI is too large, redraw or zoom in</Well>
        )}
      </>
      <Button type="submit" disabled={aoiTooLarge}>
        Search
      </Button>
    </form>
  );
};

export default SatelliteSearchForm;
