import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button, TextField, Select } from '@astrosat/astrosat-ui';

import validate from '../bookmarks/bookmark-form.validator';

import formStyles from '../forms.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'components';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { bookmarkTitle, FIELD_NAMES } from 'utils/validators';

const validationSchema = object({
  [FIELD_NAMES.bookmarkTitle]: bookmarkTitle,
  [FIELD_NAMES.bookmarkDescription]: string(),
});

const NewMapForm = ({ regions, domains, bookmarkTitles }) => {
  const { register, handleSubmit, errors, watch, formState } = useForm();
  const history = useHistory();

  function onSubmit() {
    history.push('/map');
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <TextField
          inputRef={register}
          name={FIELD_NAMES.bookmarkTitle}
          id={FIELD_NAMES.bookmarkTitle}
          label="Title"
          placeholder="Add Title*"
          error={!!errors[FIELD_NAMES.bookmarkTitle]}
          helperText={errors[FIELD_NAMES.bookmarkTitle]?.message}
          autoFocus
        />
      </Form.Row>

      <Form.Row>
        <TextField
          inputRef={register}
          name={FIELD_NAMES.bookmarkDescription}
          id={FIELD_NAMES.bookmarkDescription}
          label="Description"
          placeholder="Add Description"
          error={!!errors[FIELD_NAMES.bookmarkTitle]}
          helperText={errors[FIELD_NAMES.bookmarkTitle]?.message}
        />
      </Form.Row>

      <Form.Row>
        <Select
          ref={register}
          name="region"
          id="region"
          label="region"
          error={!!errors['region']}
          helperText={errors['region']?.message}
          multiple={true}
          value={regions.map(r => r.name)}
        >
          {regions.map(r => (
            <option>{r.name}</option>
          ))}
        </Select>
        <Select
          name="domain"
          id="domain"
          label="domain"
          ref={register}
          value={domains}
          disabled={!watch('region')}
        >
          {domains.map(domain => ({ name: domain, value: domain }))}
        </Select>
      </Form.Row>

      <Form.Row centered>
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Create
        </Button>
      </Form.Row>
    </Form>
  );
};

NewMapForm.propTypes = {};

export default NewMapForm;
