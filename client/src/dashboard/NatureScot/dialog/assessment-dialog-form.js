import React, { useEffect } from 'react';

import { Button, makeStyles, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';

import { FieldWrapper } from './assessment-field-wrapper.component';
import AssessmentsShuttle from './assessments-shuttle.component';

const now = new Date();
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const validationSchema = yup.object({
  description: yup.string().min(3, 'Description must be at least 3 characters'),
  startDate: yup.date().min(midnight, 'Start date must be today or later'),
  endDate: yup.date().min(midnight, 'End date must be today or later'),
  activities: yup.array().min(1, 'At least one activity must be selected'),
});

const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  descriptionText: {
    fontSize: '1rem',
  },
  innerText: {
    fontStyle: 'italic',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  dateRange: {
    width: '50%',
  },
  fieldset: {
    margin: '2rem 0 0 0',
  },
  field: {
    padding: '2rem',
  },
  strapline: {
    fontSize: '0.8125rem',
  },
}));

const DescriptionInput = ({ register }) => {
  const styles = useStyles();
  return (
    <div className={styles.fieldset}>
      <FieldWrapper title="Describe Your Development or Change">
        <div className={styles.field}>
          <p className={styles.descriptionText}>
            Please provide a basic description of your development or change
            e.g.{' '}
            <span className={styles.innerText}>
              build a burn, convert shed to the house, clear a wood etc.
            </span>
          </p>

          <TextField
            id="description"
            name="description"
            {...register('description')}
            label="Please describe your development or change here"
            InputProps={{
              disableUnderline: true,
              className: styles.input,
              'data-testid': 'description',
            }}
            maxLength={150}
          />
        </div>
      </FieldWrapper>
    </div>
  );
};

const DateRange = ({ startDate, endDate, onChange }) => {
  const styles = useStyles();
  const title = 'Describe Your Development or Change';
  const range = !!startDate && !!endDate ? { startDate, endDate } : null;
  return (
    <div className={styles.fieldset}>
      <FieldWrapper title={title}>
        <div className={styles.field}>
          <p className={styles.descriptionText}>
            Please use the date pickers below to confirm when your development
            or change will take place.
          </p>

          <div className={styles.dateRange}>
            <DateRangeFilter
              minDate={startDate ?? 'today'}
              range={range}
              onSubmit={onChange}
            />
          </div>
        </div>
      </FieldWrapper>
    </div>
  );
};

/**
 * @param {{
 * onSubmit: function,
 * formState: object,
 * setFormIsDirty: function,
 * activities: object[],
 * setReportGeneratedTimestamp: function
 * }} props
 */
const AssessmentDialogForm = ({
  onSubmit,
  formState,
  setFormIsDirty,
  activities,
  setReportGeneratedTimestamp,
}) => {
  const styles = useStyles();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { isDirty, errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: formState,
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const { activities: selectedActivities, startDate, endDate } = formState;

  /**
   * @param {{
   *  startDate: DateRange<string>,
   *  endDate: DateRange<string>
   * }} props
   */
  const handleDateRangeSelection = ({ startDate, endDate }) => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
    };
    setValue('startDate', startDate, options);
    setValue('endDate', endDate, options);
  };

  /**
   * @param {{
   *  startDate: DateRange<string>,
   *  endDate: DateRange<string>,
   *  rest: any
   * }} props
   */
  const doSubmit = ({ startDate, endDate, ...rest }) => {
    const processedForm = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...rest,
    };
    onSubmit(processedForm);
    setReportGeneratedTimestamp(new Date());
    setFormIsDirty(false);
  };

  // This is not part of react-hook-form, it is a standard local state
  // boolean to determine whether or not the yes/no dialog should open
  useEffect(() => setFormIsDirty(isDirty), [isDirty, setFormIsDirty]);

  return (
    <Form onSubmit={handleSubmit(doSubmit)}>
      <Form.Row>
        <DescriptionInput register={register} />
      </Form.Row>

      <Form.Row>
        <DateRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateRangeSelection}
        />
      </Form.Row>

      <Form.Row>
        <div className={styles.fieldset}>
          <FieldWrapper title="Select activities">
            <div className={styles.field}>
              <AssessmentsShuttle
                setValue={setValue}
                availableActivities={activities}
                initialActivities={selectedActivities}
              />
            </div>
          </FieldWrapper>

          <div className={styles.row}>
            <Button
              type="submit"
              disabled={Object.keys(errors).length > 0 || !isValid}
            >
              Run impact assessment
            </Button>
          </div>
        </div>
      </Form.Row>
    </Form>
  );
};

export default AssessmentDialogForm;
