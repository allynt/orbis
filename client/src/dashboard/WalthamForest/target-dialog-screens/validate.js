export const validate = input => {
  let error;
  if (isNaN(Number(input))) {
    console.log('not a number');
    error = 'must be number';
  }
  return { error };
};
