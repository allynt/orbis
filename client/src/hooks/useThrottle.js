import { useCallback } from 'react';

import { throttle } from 'lodash';

/**
 * A generic hook to let you use the lodash throttle feature on your functions.
 *
 * @param callback - The callback function to execute.
 * @param delay - The delay to use when throttling.
 *
 * @returns A throttled callback function that can be executed.
 */
export const useThrottle = (callback, delay) =>
  useCallback(
    throttle((...args) => callback(...args), delay),
    [delay],
  );
