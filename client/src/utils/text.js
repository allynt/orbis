import { string as yupString } from 'yup';

const wordToTitleCase = text => {
  const lower = text.toLowerCase();
  const firstChar = lower.charAt(0);
  const rest = lower.slice(1);
  return [firstChar.toUpperCase(), ...rest].join('');
};

export const toTitleCase = text => {
  const words = text.split(/_|\s|-/);
  return words.map(word => wordToTitleCase(word)).join(' ');
};

const emailSchema = yupString().required().email();

/**
 * @param {string} string
 * @returns true if valid email address
 */
export const isEmail = string => emailSchema.isValidSync(string);

const URL_REGEX =
  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

/**
 * @param {string} string
 */
export const isUrl = string => URL_REGEX.test(string);
