import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'components';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FIELD_NAMES, name } from 'utils/validators';
import * as yup from 'yup';
import { ADMIN_STATUS } from '../admin.constants';
import { getCheckboxLicences, getUpdatedLicenceIds } from '../licence-utils';

const validationSchema = yup.object({
  [FIELD_NAMES.name]: name,
});

/**
 * @param {{
 *   user: import('typings/orbis').CustomerUser
 *   customer: import('typings/orbis').Customer
 *   availableLicences: import('typings/orbis').Licence[]
 *   oneAdminRemaining?: boolean
 *   editUser: (user: import('typings/orbis').CustomerUser) => void
 *   close: () => void
 * }} props
 */
export const EditUserForm = ({
  user,
  customer,
  availableLicences,
  oneAdminRemaining,
  editUser,
  close,
}) => {
  const checkboxLicences = getCheckboxLicences(
    customer,
    user,
    availableLicences,
  );

  /**
   * @returns {{
   *   name: string
   *   type: string
   *   [key:string]: any
   * }}
   */
  const getDefaults = () => {
    const defaults = {
      name: user?.user.name,
      type: user?.type,
    };

    for (let licence of checkboxLicences) {
      defaults[licence.orb] = licence.customer_user === user.id;
    }

    return defaults;
  };

  const { register, handleSubmit, errors, formState, control } = useForm({
    defaultValues: getDefaults(),
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = values => {
    const editedUser = {
      ...user,
      type: values.type,
      licences: getUpdatedLicenceIds(customer, user, values),
      user: {
        ...user?.user,
        name: values.name,
      },
    };

    editUser(editedUser);
    close();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <TextField
          name={FIELD_NAMES.name}
          id={FIELD_NAMES.name}
          inputRef={register}
          label="Name"
          error={!!errors[FIELD_NAMES.name]}
          helperText={errors[FIELD_NAMES.name]?.message}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          name="email"
          label="Email"
          value={user?.user.email}
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="h2">Project Access</Typography>
          </FormLabel>
          <FormGroup row>
            {checkboxLicences.map(l => (
              <Controller
                key={l.id}
                name={l.orb}
                control={control}
                render={props => (
                  <FormControlLabel
                    label={l.orb}
                    control={
                      <Checkbox
                        onChange={e => props.onChange(e.target.checked)}
                        checked={props.value}
                      />
                    }
                  />
                )}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Form.Row>
      <Form.Row>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="h2">Admin Rights</Typography>
          </FormLabel>
          <Controller
            name="type"
            control={control}
            as={
              <RadioGroup row>
                <FormControlLabel
                  label="Yes"
                  value={ADMIN_STATUS.manager}
                  control={<Radio />}
                />
                <FormControlLabel
                  label="No"
                  value={ADMIN_STATUS.member}
                  disabled={oneAdminRemaining}
                  control={<Radio />}
                />
              </RadioGroup>
            }
          />
        </FormControl>
      </Form.Row>
      <Form.Row centered>
        <Button
          type="submit"
          disabled={!formState.isDirty || Object.keys(errors).length > 0}
        >
          Save Changes
        </Button>
      </Form.Row>
    </Form>
  );
};
