import { useRef, useEffect } from 'react';

/**
 * @param {() => void} onClickaway A function to fire when the element is clicked away from
 */
export const useClickaway = onClickaway => {
  const ref = useRef();

  /** @param {MouseEvent & {path: undefined | HTMLElement[]}} event */
  const handleClickOutside = event => {
    const path = event.path || event.composedPath();
    if (ref.current && onClickaway && !path.includes(ref.current)) {
      onClickaway();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return [ref];
};
