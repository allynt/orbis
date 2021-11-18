export const GroupedDataTransformer = data => [
  ...Object.values(
    data.reduce(
      (acc, cur) => ({
        gross: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
        net: [...acc.net, { x: cur.Year, y: cur['Total Net'] }],
      }),
      { gross: [], net: [] },
    ),
  ),
];

export const LineDataTransformer = data => {
  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  return data.map(obj =>
    // @ts-ignore
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {}),
  );
};
