import React, { useState } from 'react';

import {
  Button,
  Checkbox as AuiCheckbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  makeStyles,
  Tooltip,
  Well,
} from '@astrosat/astrosat-ui/';

import { subDays } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';

import { DateRangeInput, DateRangePicker, InfoButton } from 'components';
import { InfoType } from 'satellites/satellite.constants';
import { dateStringToDate, formatDate } from 'utils/dates';

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

export const transform = {
  /**
   * @param {Partial<import('typings/satellites').SavedSearch>} search
   * @param {import('typings/satellites').Satellite[]} satellites
   */
  toForm: (search, satellites) => ({
    satellites: boolObjectForIdArray(satellites, search?.satellites),
    startDate:
      search?.start_date && formatDate(dateStringToDate(search?.start_date)),
    endDate: search?.end_date && formatDate(dateStringToDate(search?.end_date)),
  }),
  /**
   * @param {{
   *  satellites?: {[key: string]: boolean}
   *  startDate?: string
   *  endDate?: string
   * }} form
   */
  toSearch: form => ({
    satellites: keyArrayForTruthyObjectValues(form?.satellites ?? {}),
    start_date:
      form.startDate && dateStringToDate(form.startDate).toISOString(),
    end_date: form.endDate && dateStringToDate(form.endDate).toISOString(),
  }),
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
  tooltip: {
    maxWidth: '900px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  arrow: {
    color: theme.palette.background.default,
  },
}));

/**
 * @param {{
 *  satellites: import('typings/satellites').Satellite[],
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  currentSearch?: Partial<import('typings/satellites').SavedSearch>
 *  onSubmit: (search: Pick<
 *                      import('typings/satellites').SavedSearch,
 *                      'satellites' | 'start_date' | 'end_date'
 *                    >) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SearchForm = ({
  satellites,
  aoi,
  aoiTooLarge = false,
  currentSearch = {
    satellites: ['sentinel-2'],
    start_date: subDays(new Date(), 30).toISOString(),
    end_date: new Date().toISOString(),
  },
  onSubmit: onSubmitProp,
  onInfoClick,
}) => {
  const styles = useStyles({});
  const [pickerOpen, setPickerOpen] = useState(false);

  const { register, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: transform.toForm(currentSearch, satellites),
  });

  const onSubmit = values => {
    onSubmitProp(transform.toSearch(values));
  };

  const handleInfoClick = info => () => {
    onInfoClick(info);
  };

  /** @param {import('typings/orbis').DateRange<Date>} range */
  const handleDateRangePickerApply = range => {
    setValue('startDate', range.startDate, {
      shouldValidate: true,
    });
    setValue('endDate', range.endDate, {
      shouldValidate: true,
    });
    setPickerOpen(false);
  };

  const handleDateRangeClick = () => setPickerOpen(open => !open);

  const handleResetClick = () => {
    setValue('startDate', undefined);
    setValue('endDate', undefined);
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
                type: InfoType.SATELLITE,
                data: satellite,
              })}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Divider className={styles.divider} />
      <Tooltip
        classes={{
          tooltip: styles.tooltip,
          arrow: styles.arrow,
        }}
        interactive
        arrow
        placement="right"
        open={pickerOpen}
        PopperProps={{
          popperOptions: {
            modifiers: {
              offset: {
                enabled: true,
                offset: '0px, 8px',
              },
            },
          },
        }}
        title={
          <DateRangePicker
            initialRange={{
              startDate: dateStringToDate(watch('startDate')),
              endDate: dateStringToDate(watch('endDate')),
            }}
            onApply={handleDateRangePickerApply}
          />
        }
      >
        <DateRangeInput
          register={register}
          onDateRangeClick={handleDateRangeClick}
          onResetClick={handleResetClick}
        />
      </Tooltip>
      {aoiTooLarge && (
        <Well severity="error">AOI is too large, redraw or zoom in</Well>
      )}
      <Button type="submit" disabled={!aoi || aoiTooLarge}>
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
