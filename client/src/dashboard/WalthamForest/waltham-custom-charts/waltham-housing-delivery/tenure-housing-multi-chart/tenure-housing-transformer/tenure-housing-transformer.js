// TODO: needs type comments

export const tenureHousingTransformer = (apiData, targets = {}) => {
  if (!apiData) return;

  const noTargets = !Object.keys(targets).length;

  const apiYears = apiData.map(obj => {
    const [year] = obj.Year.split('-');
    return +year;
  });

  const targetYears = noTargets
    ? []
    : Object.keys(targets).map(key => {
        const [year] = key.split('-');
        return +year;
      });

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears);
  const max = Math.max(...apiYears);

  let timeline = [];
  for (let i = min; i <= max; i++) {
    timeline = [...timeline, `${i}-${i + 1}`];
  }

  const transformedTargets = noTargets
    ? null
    : Object.entries(targets).reduce(
        (acc, [key, value]) =>
          !timeline.includes(key) ? acc : [...acc, { x: key, y: +value }],
        [],
      );

  // all you have to do is pass a api transformer
  // all this^ can be re-used

  const transformedData = apiData;

  return { transformedData, transformedTargets };
};
