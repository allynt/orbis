import React from 'react';

import {
  Checkbox,
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
 * geometryTooLarge?: boolean
 * currentSearch: import('typings/satellites').SavedSearch
 * onSubmit: (search: Pick<
 *                      import('typings/satellites').SavedSearch,
 *                      'satellites' | 'start_date' | 'end_date' | 'tiers'
 *                    >) => void
 * setSelectedMoreInfo: (params: {type: string, data: any}) => void,
 * toggleMoreInfoDialog: () => void,
 * }} props
 */
const SatelliteSearchForm = ({
  satellites,
  geometryTooLarge = false,
  currentSearch = { satellites: ['sentinel-2'], tiers: ['free'] },
  onSubmit: onSubmitProp,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
}) => {
  const styles = useStyles({});

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      ...currentSearch,
      start_date: currentSearch?.start_date
        ? new Date(currentSearch.start_date)
        : subDays(new Date(), DAYS_IN_PAST),
      end_date: currentSearch?.end_date
        ? new Date(currentSearch.end_date)
        : new Date(),
    },
  });

  /**
   * @param {ReturnType<getValues>} values
   */
  const onSubmit = values => {
    const query = {
      ...values,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date.toISOString(),
    };
    onSubmitProp(query);
  };

  /**
   * @param {'satellites' | 'tiers'} group
   * @param {string} changedId
   */
  const handleCheckboxChange = (group, changedId) => {
    /** @type {string[]} */
    const existingIds = getValues(group);
    return existingIds?.includes(changedId)
      ? existingIds?.filter(id => id !== changedId)
      : [...(existingIds ?? []), changedId];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Satellite Image Source</FormLabel>
        <FormGroup>
          <Controller
            name="satellites"
            control={control}
            render={props => (
              <>
                {satellites?.map(satellite => (
                  <div key={satellite.id} className={styles.checkbox}>
                    <FormControlLabel
                      label={satellite.label}
                      control={
                        <Checkbox
                          onChange={() =>
                            props.onChange(
                              handleCheckboxChange('satellites', satellite.id),
                            )
                          }
                          defaultChecked={currentSearch?.satellites?.includes(
                            satellite.id,
                          )}
                        />
                      }
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
              </>
            )}
          />
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
          <Controller
            name="tiers"
            control={control}
            render={props => (
              <>
                {TIERS.map(tier => (
                  <div key={tier.id} className={styles.checkbox}>
                    <FormControlLabel
                      label={tier.label}
                      control={
                        <Checkbox
                          onChange={() =>
                            props.onChange(
                              handleCheckboxChange('tiers', tier.id),
                            )
                          }
                          defaultChecked={currentSearch?.tiers?.includes(
                            tier.id,
                          )}
                        />
                      }
                    />
                    <InfoButton
                      onClick={() => {
                        setSelectedMoreInfo({ type: TIER, data: tier });
                        toggleMoreInfoDialog();
                      }}
                    />
                  </div>
                ))}
              </>
            )}
          />
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
