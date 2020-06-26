import React from 'react';
import { useForm } from 'react-hook-form';

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
      <input ref={register} type="text" name="name" id="name" placeholder="Name" />
      <label for="email">Email</label>
      <input ref={register} type="text" name="email" id="email" placeholder="Email" />
      <fieldset>
        <legend>Licences</legend>
        {licences?.length ? (
          licences.map(licence => (
            <label key={licence.name}>
              <input
                ref={register}
                type="checkbox"
                name="licences"
                value={licence.name}
                disabled={!licence.available}
              />
              {licence.name}
            </label>
          ))
        ) : (
          <p>No Licences Available</p>
        )}
      </fieldset>
      <button type="submit">Create User</button>
    </form>
  );
};
