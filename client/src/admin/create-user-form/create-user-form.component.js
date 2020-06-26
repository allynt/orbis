import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Textfield } from '@astrosat/astrosat-ui';

/**
 * @param {{licences?: {
 *            name: string,
 *            available: boolean
 *          }[],
 *          onSubmit({name: string, email: string, licences: string[]}): void
 *        }} props
 */
export const CreateUserForm = ({ licences, onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form className="createUserForm" onSubmit={handleSubmit(v => onSubmit(v))}>
      <label for="name">Name</label>
      <Textfield ref={register} name="name" id="name" placeholder="Name" />
      <label for="email">Email</label>
      <Textfield ref={register} name="email" id="email" placeholder="Email" />
      <fieldset>
        <legend>Licences</legend>
        {licences?.length ? (
          licences.map(licence => (
            <Checkbox
              key={licence.name}
              label={licence.name}
              ref={register}
              type="checkbox"
              name="licences"
              value={licence.name}
              disabled={!licence.available}
            />
          ))
        ) : (
          <p>No Licences Available</p>
        )}
      </fieldset>
      <Button type="submit">Create User</Button>
    </form>
  );
};
