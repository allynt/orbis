import React from 'react';

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
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import {
  getCheckboxLicences,
  getUpdatedLicenceIds,
} from 'mission-control/views/licence-utils';
import { FIELD_NAMES, name } from 'utils/validators';

const validationSchema = yup.object({
  [FIELD_NAMES.name]: name,
});

/**
 * @param {{
 *   user: import('typings').CustomerUser
 *   currentUser: import('typings').User
 *   customer: import('typings').Customer
 *   availableLicences: import('typings').Licence[]
 *   oneAdminRemaining?: boolean
 *   editUser: (user: import('typings').CustomerUser) => void
 * }} props
 */
export const EditUserForm = ({
  user,
  currentUser,
  customer,
  availableLicences,
  oneAdminRemaining,
  editUser,
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

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm({
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
  };

  const checkboxes = (loggedInUser, selectedUser) => {
    if (loggedInUser.id === selectedUser.user.id) {
      // cant change own settings
      return (
        <RadioGroup row>
          <FormControlLabel
            label="Yes"
            value={ADMIN_STATUS.manager}
            checked={user.type === ADMIN_STATUS.manager}
            disabled={true}
            control={<Radio />}
          />
          <FormControlLabel
            label="No"
            value={ADMIN_STATUS.member}
            checked={user.type === ADMIN_STATUS.member}
            disabled={true}
            control={<Radio />}
          />
        </RadioGroup>
      );
    } else {
      return (
        <RadioGroup row>
          <FormControlLabel
            label="Yes"
            value={ADMIN_STATUS.manager}
            control={<Radio />}
          />
          <FormControlLabel
            label="No"
            value={ADMIN_STATUS.member}
            control={<Radio />}
          />
        </RadioGroup>
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <TextField
          name={FIELD_NAMES.name}
          id={FIELD_NAMES.name}
          {...register(FIELD_NAMES.name)}
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
            <Typography variant="h2" gutterBottom>
              Project Access
            </Typography>
          </FormLabel>
          <FormGroup row>
            {checkboxLicences.map(l => (
              <Controller
                key={l.id}
                name={l.orb}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    label={l.orb}
                    control={
                      <Checkbox
                        onChange={e => onChange(e.target.checked)}
                        checked={value}
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
            <Typography variant="h2" gutterBottom>
              Admin Rights
            </Typography>
          </FormLabel>
          <Controller
            name="type"
            control={control}
            render={({ field: { value } }) => (
              <RadioGroup row>
                <FormControlLabel
                  label="Yes"
                  value={ADMIN_STATUS.manager}
                  // checked={
                  //   user.type === ADMIN_STATUS.manager &&
                  //   currentUser?.id !== user.user.id
                  // }
                  disabled={currentUser?.id === user.user.id}
                  control={<Radio />}
                />
                <FormControlLabel
                  label="No"
                  value={ADMIN_STATUS.member}
                  // checked={
                  //   user.type === ADMIN_STATUS.member ||
                  //   value === ADMIN_STATUS.member
                  // }
                  disabled={currentUser?.id === user.user.id}
                  control={<Radio />}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Form.Row>
      <Form.Row centered>
        <Button
          type="submit"
          disabled={!isDirty || Object.keys(errors).length > 0}
        >
          Save Changes
        </Button>
      </Form.Row>
    </Form>
  );
};
