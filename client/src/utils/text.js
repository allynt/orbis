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
