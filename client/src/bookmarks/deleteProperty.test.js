import { deleteProperty } from './deleteProperty';

describe('deleteProperty', () => {
  it('omits properties from object that match given parameter', () => {
    const testData = {
      deleteMe: true,
    };

    const result = deleteProperty(testData, 'deleteMe');
    expect(result).toEqual({ deleteMe: undefined });
    expect(testData.deleteMe).toBe(true);
  });

  it('also works on nested objects', () => {
    const testData = {
      levelOne: {
        anotherOnLevelOne: {},
        levelTwo: {
          levelThree: {
            deleteMe: [4, 5, 6],
            anotherOnLevelThree: [1, 2, 3],
          },
          dontDeleteMe: {},
          orMeEither: {},
        },
      },
    };

    const result = deleteProperty(testData, 'deleteMe');

    expect(result).toEqual({
      levelOne: {
        anotherOnLevelOne: {},
        levelTwo: {
          levelThree: {
            anotherOnLevelThree: [1, 2, 3],
          },
          dontDeleteMe: {},
          orMeEither: {},
        },
      },
    });
  });
});
