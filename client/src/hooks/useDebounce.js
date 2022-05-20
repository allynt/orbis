import { useCallback } from 'react';

import { debounce } from 'lodash';

/**
 * A generic hook to let you use the lodash debounce feature on your functions.
 *
 * @param callback - The callback function to execute.
 * @param delay - The delay to use when debouncing.
 *
 * @returns A debounced callback function that can be executed.
 */
export const useDebounce = (callback, delay) =>
  useCallback(
    debounce((...args) => callback(...args), delay),
    [delay],
  );
