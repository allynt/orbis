export const VECTOR = 'vector';
export const RASTER = 'raster';

export const regions = [
  {
    name: 'Europe',
    value: {
      zoom: 6,
      center: [2.588083, 48.953583],
    },
  },
  {
    name: 'Africa',
    value: {
      zoom: 6,
      center: [23.44175, 0.0],
    },
  },
  {
    name: 'Central Asia',
    value: {
      zoom: 6,
      center: [68.110556, 45.517806],
    },
  },
  {
    name: 'North America',
    value: {
      zoom: 6,
      center: [-104.634381, 51.83855],
    },
  },
];

export const LAYER_IDS = {
  astrosat: {
    isolationPlus: {
      ageDemographics: {
        v1: 'astrosat/isolation_plus/age/v1',
        v2: 'astrosat/isolation_plus/age/v2',
      },
      ahah: {
        v1: 'astrosat/isolation_plus/ahah/v1',
        v2: 'astrosat/isolation_plus/ahah/v2',
      },
      broadbandConnectivity: {
        v1: 'astrosat/isolation_plus/broadband/v1',
        v2: 'astrosat/isolation_plus/broadband/v2',
      },
      childPoverty: {
        v1: 'astrosat/isolation_plus/childpov/v1',
        v2: 'astrosat/isolation_plus/childpov/v2',
      },
      deprivedHouses: {
        v1: 'astrosat/isolation_plus/depriv/v1',
        v2: 'astrosat/isolation_plus/depriv/v2',
      },
      imdIncome: {
        v1: 'astrosat/isolation_plus/imd_income/v1',
        v2: 'astrosat/isolation_plus/imd_income/v2',
      },
      localFuelPoverty: {
        v1: 'astrosat/isolation_plus/lfp/v1',
        v2: 'astrosat/isolation_plus/lfp/v2',
      },
      mobileConnectivity: {
        v1: 'astrosat/isolation_plus/mobile/v1',
        v2: 'astrosat/isolation_plus/mobile/v2',
      },
    },
    rice: {
      paddiesHealth: {
        latest: 'astrosat/rice/paddies-health/latest',
      },
    },
    covid: {
      hourglass: {
        latest: 'astrosat/covid/hourglass/latest',
      },
      commonWeal: {
        latest: 'astrosat/covid/cw/latest',
      },
    },
    hourglass: {
      people: {
        v1: 'astrosat/hourglass/people/v1',
      },
      scotlandInfrastructure: {
        v1: 'astrosat/hourglass/scotland-infrastructure/v1',
      },
      northernIrelandInfrastructure: {
        v1: 'astrosat/hourglass/northern-ireland-infrastructure/v1',
      },
      walesInfrastructure: {
        v1: 'astrosat/hourglass/wales-infrastructure/v1',
      },
    },
  },
};
