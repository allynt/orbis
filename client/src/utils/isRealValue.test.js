import { isRealValue } from './isRealValue';

describe('isRealValue', () => {
  it.each`
    value        | returnType
    ${true}      | ${true}
    ${false}     | ${true}
    ${''}        | ${true}
    ${0}         | ${true}
    ${-1}        | ${true}
    ${NaN}       | ${false}
    ${null}      | ${false}
    ${undefined} | ${false}
  `('Returns $returnType if value is $value', ({ returnType, value }) => {
    expect(isRealValue(value)).toBe(returnType);
  });
});
