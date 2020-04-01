import { toTitleCase } from './text';

describe('Text utils', () => {
  describe('toTitleCase', () => {
    it('Should convert lowercase words', () => {
      const word = 'hello';
      const expected = 'Hello';
      expect(toTitleCase(word)).toBe(expected);
    });

    it('Should convert uppercase words', () => {
      const word = 'HELLO';
      const expected = 'Hello';
      expect(toTitleCase(word)).toBe(expected);
    });

    it('should convert lowercase sentences', () => {
      const word = 'hello i am here';
      const expected = 'Hello I Am Here';
      expect(toTitleCase(word)).toBe(expected);
    });

    it('should convert upper case sentences', () => {
      const word = 'HELLO I AM HERE';
      const expected = 'Hello I Am Here';
      expect(toTitleCase(word)).toBe(expected);
    });

    it('Should convert snake case', () => {
      const word = 'hello_i_am_here';
      const expected = 'Hello I Am Here';
      expect(toTitleCase(word)).toBe(expected);
    });

    it('should convert kebab case sentences', () => {
      const word = 'hello-i-am-here';
      const expected = 'Hello I Am Here';
      expect(toTitleCase(word)).toBe(expected);
    });
  });
});
