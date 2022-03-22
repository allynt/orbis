import React, { useState } from 'react';

import { Button, makeStyles, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { subYears } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';

import { FieldWrapper } from './assessment-field-wrapper.component';

const validationSchema = yup.object({
  description: yup.string(),
});

const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  descriptionText: {
    fontSize: 14,
  },
  innerText: {
    fontStyle: 'italic',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const DEFAULT_DATE_RANGE = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

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
        label="Describe Your Change or Development"
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

      <DateRangeFilter onSubmit={onChange} range={DEFAULT_DATE_RANGE} />
    </FieldWrapper>
  );
};

const AssessmentDialogForm = ({ onSubmit }) => {
  const styles = useStyles();

  const [areActivitiesVisible, setAreActivitiesVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { ...DEFAULT_DATE_RANGE },
    resolver: yupResolver(validationSchema),
  });
  console.log('ERRORS/IS DIRTY: ', errors, isDirty);

  const handleDateRangeSelection = range => {
    console.log('DATE RANGE: ', range);
    setValue('startDate', range.startDate, { shouldValidate: true });
    setValue('endDate', range.endDate, { shouldValidate: true });
  };

  const doSubmit = form => {
    console.log('form', form);
    // onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit(doSubmit)}>
      <Form.Row>
        <DescriptionInput register={register} />
      </Form.Row>

      <Form.Row>
        <DateRange onChange={handleDateRangeSelection} />
      </Form.Row>

      {areActivitiesVisible ? <div>Yes, I'm here</div> : null}

      <Form.Row>
        <div className={styles.row}>
          <Button
            onClick={() => setAreActivitiesVisible(!areActivitiesVisible)}
          >
            Show proposed activities
          </Button>
        </div>
      </Form.Row>

      <Form.Row>
        <div className={styles.row}>
          <Button type="submit" disabled={!errors && isDirty}>
            Submit Assessment
          </Button>
        </div>
      </Form.Row>
    </Form>
  );
};

export default AssessmentDialogForm;
