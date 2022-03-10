import { inputErrorMessage } from '../waltham.constants';
export const validate = targets => {
  let error = undefined;
  const values = Object.values(targets);

  if (values.every(v => !v)) {
    return error;
  }

  if (values.some(v => isNaN(v))) {
    error = inputErrorMessage;
    return error;
  }
};
