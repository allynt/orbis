import { setPopupFeatures } from '../slices/mysupplylynk.slice';
import configFn from './categoryFilterPinIconConfig';

const setup = () => {
  const dispatch = jest.fn();
  const fns = configFn({
    dispatch,
  });
  return { ...fns, dispatch };
};

describe('categoryFilterPinIconConfig', () => {
  describe('getFeatures', () => {
    it.todo(
      'filters the data based on the Category property and filters in state',
    );
  });

  describe('onHover', () => {
    it.todo('Does not call dispatch if popupFeatures has length');

    it.todo(
      `Dispatches the ${setPopupFeatures.type} action if onPointHover is true`,
    );
  });

  describe('onClick', () => {
    it.todo(
      `Dispatches the ${setPopupFeatures.type} action if onGroupClick is true and the clicked features have length > 1`,
    );

    it.todo('Handles point clicks');
  });
});
