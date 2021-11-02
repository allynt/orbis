import validate from './validate';

describe('validate', () => {
  it('Returns true if the file is valid', async () => {
    const testFile = new File(
      [`latitude,longitude\nvalue1,value2`],
      'test.csv',
      {
        type: 'text/csv',
      },
    );

    const result = await validate(testFile);

    expect(result).toBe(true);
  });

  it('returns error message if file is wrong format', async () => {
    const testFile = new File(['latitude,longitude'], 'test.pdf');

    const result = await validate(testFile);

    expect(result).toMatchInlineSnapshot(
      `"Invalid file format. Please upload a file according to the guidelines!"`,
    );
  });

  it('returns error message if file is empty', async () => {
    const testFile = new File([], 'test.csv');

    const result = await validate(testFile);

    expect(result).not.toBeFalsy();
    expect(result).toMatchInlineSnapshot(
      `"The uploaded file is empty, therefore we can not show anything on the map. Please fill it with data and start the upload process again. We are not saving this file so you don’t have to worry about it."`,
    );
  });

  it('returns error if lon/lat headers are not present', async () => {
    const testFile = new File(['header1,header2\nval1,val2'], 'test.csv');

    const result = await validate(testFile);

    expect(result).toMatchInlineSnapshot(
      `"Must include latitude and longitude headers"`,
    );
  });
});
