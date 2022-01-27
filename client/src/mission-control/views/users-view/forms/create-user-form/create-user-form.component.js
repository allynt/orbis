import React from 'react';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
import { FIELD_NAMES, uniqueEmail } from 'utils/validators';

const validationSchema = yup.object({
  [FIELD_NAMES.email]: uniqueEmail,
  [FIELD_NAMES.name]: yup.string(),
});

/**
 * @param {{
 *   licenceInformation?: {
 *     [key: string]: {
 *       purchased: number,
 *       available: number,
 *       active: number,
 *       pending: number
 *     }
 *   },
 *   existingEmails: string[],
 *   onSubmit({
 *     name: string,
 *     email: string,
 *     licences: string[]
 *   }): void
 * }} props
 */
export const CreateUserForm = ({
  licenceInformation,
  existingEmails = [],
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    context: { existingEmails },
  });

  const createUser = data => {
    const values = {
      ...data,
      licences: data.licences
        ? Array.isArray(data.licences)
          ? data.licences
          : [data.licences]
        : [],
    };

    onSubmit(values);
  };

  return (
    <Form onSubmit={handleSubmit(createUser)}>
      <Form.Row>
        <TextField
          {...register(FIELD_NAMES.name)}
          name={FIELD_NAMES.name}
          id={FIELD_NAMES.name}
          label="Name"
          error={!!errors[FIELD_NAMES.name]}
          helperText={errors[FIELD_NAMES.name]?.message}
          autoFocus
        />
      </Form.Row>
      <Form.Row>
        <TextField
          {...register(FIELD_NAMES.email)}
          name={FIELD_NAMES.email}
          id={FIELD_NAMES.email}
          label="Email"
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
        />
      </Form.Row>
      <Form.Row>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="h2" gutterBottom>
              Licences
            </Typography>
          </FormLabel>
          <FormGroup row>
            {licenceInformation && Object.keys(licenceInformation)?.length ? (
              Object.keys(licenceInformation).map(orb => (
                <FormControlLabel
                  key={orb}
                  label={orb}
                  name="licences"
                  value={orb}
                  {...register('licences')}
                  disabled={licenceInformation[orb].available <= 0}
                  control={<Checkbox />}
                />
              ))
            ) : (
              <Typography>No Licences Available</Typography>
            )}
          </FormGroup>
        </FormControl>
      </Form.Row>
      <Form.Row centered>
        <Button type="submit">Create User</Button>
      </Form.Row>
    </Form>
  );
};
