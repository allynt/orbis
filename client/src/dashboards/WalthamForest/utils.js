/** Sorts entries, each with year/gross/net values, into 2 nested arrays of gross and net, so that Victory can show a separate dataset for each. */
export const groupedDataTransformer = data => {
  if (!data) return;

  return Object.values(
    data.reduce(
      (acc, cur) => ({
        gross: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
        net: [...acc.net, { x: cur.Year, y: cur['Total Net'] }],
      }),
      { gross: [], net: [] },
    ),
  );
};

/** Creates an array of all unique keys across the entries, then creates a new object for each entry containing each of those keys, setting the entry's own value for each key if it exists, and setting it to null if it is undefined */
export const lineDataTransformer = data => {
  if (!data) return;

  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  return data.map(obj =>
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {}),
  );
};
