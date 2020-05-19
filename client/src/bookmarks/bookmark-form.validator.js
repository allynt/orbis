const validate = titles => form => {
  let errors = {};

  if (!form.title) {
    errors.title = 'Title is required';
  }

  if (titles.includes(form.title.toLowerCase())) {
    errors.duplicateTitle = `There is already a map with the title: ${form.title}`;
  }

  return errors;
};

export default validate;
