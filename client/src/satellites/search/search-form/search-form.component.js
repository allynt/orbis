import React, { useState } from 'react';

import {
  Button,
  Checkbox as AuiCheckbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  makeStyles,
  Tooltip,
  Well,
} from '@astrosat/astrosat-ui/';

import { yupResolver } from '@hookform/resolvers/yup';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DateRangeInput, DateRangePicker, InfoButton } from 'components';
import { InfoType } from 'satellites/satellite.constants';
import { dateStringToDate, formatDate } from 'utils/dates';
import { baseDate } from 'utils/validators';

const Checkbox = ({ name, control, label, onInfoClick }) => {
  const styles = useStyles();
  return (
    <div className={styles.checkbox}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControlLabel
            checked={value}
            onChange={(_event, checked) => onChange(checked)}
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
   * @param {Partial<import('typings').SavedSearch>} search
   * @param {import('typings').Satellite[]} satellites
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
      form.startDate &&
      startOfDay(dateStringToDate(form.startDate)).toISOString(),
    end_date:
      form.endDate && endOfDay(dateStringToDate(form.endDate)).toISOString(),
  }),
};

const useStyles = makeStyles(theme => ({
  form: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  searchButton: {
    margin: 'auto auto 0',
  },
  satellites: { marginBlock: theme.spacing(2) },
  checkbox: {
    display: 'flex',
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

export const validationSchema = yup.object({
  satellites: yup
    .object()
    .test(
      'some-true',
      'Select at least one satellite',
      value => value && Object.values(value).some(v => v),
    ),
  startDate: yup.string().required('Choose a start date').concat(baseDate),
  endDate: baseDate.required('Choose an end date').concat(baseDate),
});

/**
 * @param {{
 *  satellites: import('typings').Satellite[],
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  currentSearch?: Partial<import('typings').SavedSearch>
 *  onSubmit: (search: Pick<
 *                      import('typings').SavedSearch,
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: transform.toForm(currentSearch, satellites),
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = values => {
    onSubmitProp(transform.toSearch(values));
  };

  const handleInfoClick = info => () => {
    onInfoClick(info);
  };

  /** @param {import('typings').DateRange<Date>} range */
  const handleDateRangePickerApply = range => {
    setValue('startDate', formatDate(range.startDate), {
      shouldValidate: true,
    });
    setValue('endDate', formatDate(range.endDate), {
      shouldValidate: true,
    });
    setPickerOpen(false);
  };

  const handleDateRangeClick = () => setPickerOpen(open => !open);

  const handleResetClick = () => {
    setValue('startDate', formatDate(subDays(new Date(), 30)));
    setValue('endDate', formatDate(new Date()));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Tooltip
        classes={{
          tooltip: styles.tooltip,
          arrow: styles.arrow,
        }}
        interactive
        arrow
        placement="right"
        open={pickerOpen}
        title={
          <DateRangePicker
            initialRange={{
              startDate: watch('startDate')
                ? dateStringToDate(watch('startDate'))
                : new Date(),
              endDate: watch('endDate')
                ? dateStringToDate(watch('endDate'))
                : new Date(),
            }}
            onApply={handleDateRangePickerApply}
            onClose={() => setPickerOpen(false)}
          />
        }
      >
        <DateRangeInput
          register={register}
          onDateRangeClick={handleDateRangeClick}
          onResetClick={handleResetClick}
        />
      </Tooltip>
      {(!!errors.startDate || !!errors.endDate) && (
        <FormHelperText error>
          {errors.endDate?.message || errors.startDate?.message}
        </FormHelperText>
      )}
      <FormControl
        className={styles.satellites}
        component="fieldset"
        error={!!errors.satellites}
      >
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
        {!!errors.satellites && (
          <FormHelperText error>
            {
              // @ts-ignore
              errors.satellites.message
            }
          </FormHelperText>
        )}
      </FormControl>
      {aoiTooLarge && <Well severity="error">AOI is too large</Well>}
      <div className={styles.searchButton}>
        <Button type="submit" disabled={!aoi || aoiTooLarge}>
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
