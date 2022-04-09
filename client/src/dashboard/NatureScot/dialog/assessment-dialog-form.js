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

const today = new Date().toISOString();

const validationSchema = yup.object({
  description: yup.string(),
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
}));

const DescriptionInput = ({ register }) => {
  const styles = useStyles();

  return (
    <FieldWrapper title="Describe Your Development or Change">
      <p className={styles.descriptionText}>
        Please provide a basic description of your development or change e.g.{' '}
        <span className={styles.innerText}>
          build a burn, convert shed to the house, clear a wood etc.
        </span>
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
    </FieldWrapper>
  );
};

const DateRange = ({ onChange }) => {
  const styles = useStyles();
  const title = 'Describe Your Development or Change';

  return (
    <FieldWrapper title={title}>
      <p className={styles.descriptionText}>
        Please use the date pickers below to confirm when your development or
        change will take place.
      </p>

      <div className={styles.dateRange}>
        <DateRangeFilter onSubmit={onChange} minDate="today" />
      </div>
    </FieldWrapper>
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
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      startDate: today,
      endDate: today,
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
  const isSubmitButtonDisabled =
    values?.description?.length === 0 ||
    Object.keys(errors).length > 0 ||
    !isDirty;

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
          <Button onClick={() => handleFetchActivities()} disabled={false}>
            {areActivitiesVisible ? 'Hide' : 'Show'} activities
          </Button>
        </div>
      </Form.Row>

      {areActivitiesVisible ? (
        <Form.Row>
          <FieldWrapper title="Select activities">
            <AssessmentsShuttle setValue={setValue} data={activities} />
          </FieldWrapper>

          <div className={styles.row}>
            <Button type="submit" disabled={isSubmitButtonDisabled}>
              Submit Assessment
            </Button>
          </div>
        </Form.Row>
      ) : null}
    </Form>
  );
};

export default AssessmentDialogForm;
