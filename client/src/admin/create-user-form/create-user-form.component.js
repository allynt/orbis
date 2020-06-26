import React from 'react';
import { useForm } from '@astrosat/astrosat-ui';

/**
 * @param {{licences?: {
 *            name: string,
 *            available: boolean
 *          }[],
 *          onSubmit({name: string, email: string, licences: string[]}): void
 *        }} props
 */
export const CreateUserForm = ({ licences, onSubmit }) => (
  <form className="createUserForm">
    <label for="name">Name</label>
    <input type="text" name="name" id="name" placeholder="Name" />
    <label for="email">Email</label>
    <input type="text" name="email" id="email" placeholder="Email" />
    <fieldset>
      <legend>Licences</legend>
      {licences?.length ? (
        licences.map(licence => (
          <label key={licence.name}>
            <input type="checkbox" name="licences" value={licence.name} disabled={!licence.available} />
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
