import { fireEvent } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { useDocumentEventListener } from './useDocumentEventListener';

describe('useDocumentEventListener', () => {
  it('calls the callback when the event is fired on the document', () => {
    const callback = jest.fn();
    renderHook(() => useDocumentEventListener('keyup', callback));
    act(() => {
      fireEvent.keyUp(document);
    });
    expect(callback).toBeCalled();
  });
});
