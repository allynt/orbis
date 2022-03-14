import React from 'react';

import { Button, makeStyles, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
// import { register } from 'numeral';

const validationSchema = yup.object({
  description: yup.string(),
});

const useStyles = makeStyles(theme => ({}));

const DescriptionInput = ({ register }) => (
  <fieldset>
    <legend>Describe Your Development or Change</legend>
    <p>
      Please provide a basic description of your development or change e.g.
      build a burn, convert shed to the house, clear a wood etc.
    </p>
    <TextField
      id="description"
      name="description"
      {...register('description')}
      label="Describe Your Change or Development"
      placeholder="Please describe your development or change here"
      margin="normal"
      variant="filled"
      helperText="0/150 characters max length"
    />
  </fieldset>
);

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
      <Button type="submit">Submit Assessment</Button>
    </Form>
  );
};

export default AssessmentDialogForm;
