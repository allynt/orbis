export const Panels = {
  DATA_LAYERS: 'Data Layers',
  AOI: 'AOI',
  FILTERING: 'Filtering',
};

export const GEOMETRY_TYPES = {
  OA: 6,
  LSOA: 5,
  MSOA: 4,
  LAD_2016: 3,
  LAD_2019: 2,
  LAD_2020: 1,
};

export const MIN_SELECTED_PROPERTIES = 2;

// this is unlikely to change as it's a limit of
// how many attributes can be sent to a vertex shader
// (we have to assume a lowest-common-denominator GPU)
export const MAX_SELECTED_PROPERTIES = 4;
