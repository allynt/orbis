import { useEffect } from 'react';

/**
 * @param {[
 *  event: keyof DocumentEventMap,
 *  listener: (this: Document, ev: DocumentEventMap[keyof DocumentEventMap]) => any
 * ]} args
 */
export const useDocumentEventListener = (...args) => {
  useEffect(() => {
    document.addEventListener(...args);
    return () => document.removeEventListener(...args);
  }, [args]);
};
