export const validate = input => {
  let error = undefined;
  if (!input) return error;

  if (isNaN(Number(input))) {
    error = 'Number is required';
  }
  return error;
};
