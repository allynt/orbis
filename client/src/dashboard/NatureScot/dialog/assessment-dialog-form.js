import React, { useState } from 'react';

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
    marginTop: '3rem',
  },
  dateRange: {
    width: '50%',
  },
  fieldset: {
    margin: '2rem 0',
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

          <p className={styles.strapline}>
            Please describe your development or change here
          </p>

          <TextField
            id="description"
            name="description"
            {...register('description')}
            InputProps={{
              disableUnderline: true,
              className: styles.input,
            }}
            maxLength={150}
            focused
          />
        </div>
      </FieldWrapper>
    </div>
  );
};

const DateRange = ({ onChange }) => {
  const styles = useStyles();
  const title = 'Describe Your Development or Change';

  return (
    <div className={styles.fieldset}>
      <FieldWrapper title={title}>
        <div className={styles.field}>
          <p className={styles.descriptionText}>
            Please use the date pickers below to confirm when your development
            or change will take place.
          </p>

          <div className={styles.dateRange}>
            <DateRangeFilter onSubmit={onChange} minDate="today" />
          </div>
        </div>
      </FieldWrapper>
    </div>
  );
};

const AssessmentDialogForm = ({ onSubmit, selectedAoi }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [areActivitiesVisible, setAreActivitiesVisible] = useState(false);

  const activities = useSelector(impactActivitiesSelector);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      startDate: null,
      endDate: null,
      activities: [],
      geometry: selectedAoi?.geometry,
    },
    resolver: yupResolver(validationSchema),
  });

  const handleDateRangeSelection = range => {
    setValue('startDate', range.startDate, { shouldValidate: true });
    setValue('endDate', range.endDate, { shouldValidate: true });
  };

  const handleFetchActivities = () => {
    const form = getValues();
    dispatch(fetchImpactActivities(form));
    setAreActivitiesVisible(!areActivitiesVisible);
  };

  const doSubmit = form => onSubmit(form);

  const values = getValues();
  const isActivitiesButtonDisabled =
    !values?.description || !values?.startDate || !values?.endDate;

  return (
    <Form onSubmit={handleSubmit(doSubmit)}>
      <Form.Row>
        <DescriptionInput register={register} />
      </Form.Row>

      <Form.Row>
        <DateRange onChange={handleDateRangeSelection} />
      </Form.Row>

      <Form.Row>
        <div className={styles.row}>
          <Button
            onClick={() => handleFetchActivities()}
            disabled={isActivitiesButtonDisabled}
          >
            {areActivitiesVisible ? 'Hide' : 'Show'} activities
          </Button>
        </div>
      </Form.Row>

      {areActivitiesVisible ? (
        <Form.Row>
          <div className={styles.fieldset}>
            <FieldWrapper title="Select activities">
              <div className={styles.field}>
                <AssessmentsShuttle setValue={setValue} data={activities} />
              </div>
            </FieldWrapper>

            <div className={styles.row}>
              <Button type="submit" disabled={!isValid}>
                Run impact assessment
              </Button>
            </div>
          </div>
        </Form.Row>
      ) : null}
    </Form>
  );
};

export default AssessmentDialogForm;
