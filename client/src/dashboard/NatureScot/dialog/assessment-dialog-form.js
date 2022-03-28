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

const today = new Date().toISOString();

const DescriptionInput = ({ register, data, filterActivities }) => {
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
        InputProps={{
          disableUnderline: true,
          className: styles.input,
        }}
        maxLength={150}
        focused
        onChange={filterActivities}
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

      <DateRangeFilter onSubmit={onChange} minDate="today" />
    </FieldWrapper>
  );
};

const AssessmentDialogForm = ({ onSubmit }) => {
  const styles = useStyles();

  const [areActivitiesVisible, setAreActivitiesVisible] = useState(false);
  const [activities, setActivities] = useState(null);
  const [filteredActivities, setFilteredActivities] = useState(null);

  useEffect(() => {
    // Get full list of activities.
    setActivities(ACTIVITIES);
  }, [setActivities]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { startDate: today, endDate: today },
    resolver: yupResolver(validationSchema),
  });

  const handleFilterActivities = filter => {
    const filteredActivities = activities.filter(activity =>
      activity.label.includes(filter),
    );

    setFilteredActivities(filteredActivities);
  };

  const getRandomSelectionOfActivities = () => {
    // TODO: placeholder, temp filter to retrieve 15% of rows
    return activities.filter(activity => activity && Math.random() > 0.85);
  };

  const handleDateRangeSelection = range => {
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
        <DescriptionInput
          register={register}
          data={activities}
          filterActivities={event => handleFilterActivities(event.target.value)}
        />
      </Form.Row>

      <Form.Row>
        <DateRange onChange={handleDateRangeSelection} />
      </Form.Row>

      <Form.Row>
        <div className={styles.row}>
          <Button
            onClick={() => setAreActivitiesVisible(!areActivitiesVisible)}
          >
            Show proposed activities
          </Button>
        </div>
      </Form.Row>

      {areActivitiesVisible ? (
        <Form.Row>
          <FieldWrapper title="Select activities">
            <AssessmentsShuttle
              data={getRandomSelectionOfActivities()}
              selectedActivity={'Some activity'}
            />
          </FieldWrapper>
        </Form.Row>
      ) : null}

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
