import { useCallback } from 'react';

import { debounce } from 'lodash';

/**
 * A generic hook to let you use the lodash debounce feature on your functions.
 *
 * @param {function} callback - The callback function to execute.
 * @param {number} delay - The delay to use when debouncing.
 *
 * @returns A debounced callback function that can be executed.
 */
export const useDebounce = (callback, delay) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(
    debounce((...args) => callback(...args), delay),
    [delay],
  );
