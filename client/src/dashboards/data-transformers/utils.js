export const WFCGroupedDataTransformer = data => [
  ...Object.values(
    data.reduce(
      (acc, cur) => ({
        gross: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
        net: [...acc.gross, { x: cur.Year, y: cur['Total Gross'] }],
      }),
      { gross: [], net: [] },
    ),
  ),
];
