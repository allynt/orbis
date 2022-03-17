import React from 'react';

import { Button, makeStyles, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';

import AssessmentsShuttle from './assessments-shuttle.component';

const validationSchema = yup.object({
  description: yup.string(),
});

const useStyles = makeStyles(theme => ({
  fieldset: {
    border: '4px solid',
    borderColor: theme.palette.background.paper,
  },
  legend: {
    fontSize: 10,
    fontWeight: 800,
  },
  descriptionText: {
    fontSize: 14,
  },
  placeholder: {
    backgroundColor: theme.palette.background.paper,
    height: 25,
  },
}));

const DescriptionInput = ({ register }) => {
  const styles = useStyles();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Describe Your Development or Change
      </legend>
      <p className={styles.descriptionText}>
        Please provide a basic description of your development or change e.g.
        build a burn, convert shed to the house, clear a wood etc.
      </p>
      <TextField
        id="description"
        name="description"
        {...register('description')}
        label="Describe Your Change or Development"
        margin="normal"
        InputProps={{
          disableUnderline: true,
          classes: { input: styles.placeholder },
        }}
        focused
      />
    </fieldset>
  );
};

const AssessmentDialogForm = ({ onSubmit }) => {
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const doSubmit = form => {
    console.log('form', form);
  };

  return (
    <Form onSubmit={handleSubmit(doSubmit)}>
      <Form.Row>
        <DescriptionInput register={register} />
      </Form.Row>
      <Form.Row>
        <AssessmentsShuttle data={{}} selectedActivity="Foobar" />
      </Form.Row>
      <Button type="submit">Submit Assessment</Button>
    </Form>
  );
};

export default AssessmentDialogForm;
