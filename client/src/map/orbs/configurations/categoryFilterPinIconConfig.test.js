// @ts-nocheck
import {
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} from '../slices/mysupplylynk.slice';
import configFn from './categoryFilterPinIconConfig';

const DATA = {
  features: [
    {
      id: 1,
      properties: {
        Items: [{ Category: 'Category 1' }],
      },
    },
    {
      id: 2,
      properties: {
        Items: [{ Category: 'Category 1' }],
      },
    },
    {
      id: 3,
      properties: {
        Items: [{ Category: 'Category 2' }],
      },
    },
  ],
};

const CATEGORY_DATA = {
  features: [
    {
      id: 1,
      properties: {
        Category: 'Category 1',
      },
    },
    {
      id: 2,
      properties: {
        Category: 'Category 1',
      },
    },
    {
      id: 3,
      properties: {
        Category: 'Category 2',
      },
    },
  ],
};

const setup = ({ state = {}, data = DATA } = {}) => {
  const dispatch = jest.fn();
  const fns = configFn({
    id: 'test/layer',
    orbState: { mySupplyLynk: state },
    data,
    onPointHover: true,
    onGroupClick: true,
    onPointClick: true,
    dispatch,
  });
  return { ...fns, dispatch };
};

describe('categoryFilterPinIconConfig', () => {
  describe('getFeatures', () => {
    const categoryFilters = { 'test/layer': ['Category 2'] };
    it('filters the data based on the Category property and filters in state', () => {
      const { data } = setup({
        state: { categoryFilters },
      });
      expect(data).toEqual(
        expect.objectContaining({ features: [DATA.features[2]] }),
      );
    });

    it("filters data by Category if Items doesn't exist", () => {
      const { data } = setup({
        data: CATEGORY_DATA,
        state: { categoryFilters },
      });

      expect(data).toEqual(
        expect.objectContaining({ features: [CATEGORY_DATA.features[2]] }),
      );
    });
  });

  describe('onHover', () => {
    it('Does not call dispatch if popupFeatures has length > 1', () => {
      const { onHover, dispatch } = setup({
        state: { popupFeatures: { features: ['hi', 'hello'] } },
      });
      onHover({});
      expect(dispatch).not.toBeCalled();
    });

    it(`Dispatches the ${setPopupFeatures.type} action if onPointHover is true`, () => {
      const object = { properties: { test: 'hello' } };
      const { onHover, dispatch } = setup();
      onHover({ object });
      expect(dispatch).toHaveBeenCalledWith(
        setPopupFeatures(
          expect.objectContaining({
            features: [object],
          }),
        ),
      );
    });
  });

  describe('onClick', () => {
    it(`Dispatches the ${setPopupFeatures.type} action if onGroupClick is true and the clicked features have length > 1`, () => {
      const objects = [{ id: 1 }, { id: 2 }];
      const { onClick, dispatch } = setup();
      onClick({
        object: { properties: { cluster: true } },
        objects,
      });
      expect(dispatch).toHaveBeenCalledWith(
        setPopupFeatures(expect.objectContaining({ features: objects })),
      );
    });

    it('Handles point clicks', () => {
      const { onClick, dispatch } = setup();
      onClick({ object: { properties: { hello: 'test' } } });
      expect(dispatch).toHaveBeenCalledWith(
        setDialogFeatures([{ hello: 'test' }]),
      );
      expect(dispatch).toHaveBeenCalledWith(setPopupFeatures({ features: [] }));
      expect(dispatch).toHaveBeenCalledWith(toggleDialog());
    });
  });
});
