import React, { useEffect, useState } from 'react';

import { Button, makeStyles, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { Form } from 'components';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';

import {
  impactActivitiesSelector,
  fetchImpactActivities,
} from '../nature-scot.slice';
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
              minDate="today"
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
 * initialFormState: object,
 * setFormIsDirty: function
 * }} props
 */
const AssessmentDialogForm = ({
  onSubmit,
  initialFormState,
  setFormIsDirty,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [
    isAssessmentSubmitButtonDisabled,
    setIsAssessmentSubmitButtonDisabled,
  ] = useState(true);

  const activities = useSelector(impactActivitiesSelector);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: initialFormState,
    resolver: yupResolver(validationSchema),
  });

  const {
    activities: selectedActivities,
    startDate,
    endDate,
  } = initialFormState;

  const handleDateRangeSelection = ({ startDate, endDate }) => {
    const options = { shouldValidate: true, shouldDirty: true };
    setValue('startDate', startDate, options);
    setValue('endDate', endDate, options);
  };

  const doSubmit = ({ startDate, endDate, ...rest }) => {
    const processedForm = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...rest,
    };
    onSubmit(processedForm);
  };

  // disables showing of YesNo dialog if form has been changed
  useEffect(() => setFormIsDirty(isDirty), [isDirty, setFormIsDirty]);

  useEffect(() => {
    const subscription = watch(value => {
      setIsAssessmentSubmitButtonDisabled(
        !value?.description ||
          !value?.startDate ||
          !value?.endDate ||
          value.activities.length === 0,
      );
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    dispatch(fetchImpactActivities());
  }, [dispatch]);

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
                data={activities}
                initialActivities={selectedActivities}
              />
            </div>
          </FieldWrapper>

          <div className={styles.row}>
            <Button type="submit" disabled={isAssessmentSubmitButtonDisabled}>
              Run impact assessment
            </Button>
          </div>
        </div>
      </Form.Row>
    </Form>
  );
};

export default AssessmentDialogForm;
