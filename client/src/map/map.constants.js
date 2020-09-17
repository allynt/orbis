export const VECTOR = 'vector';
export const RASTER = 'raster';
export const MAX_ZOOM = 20;

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
      ageDemographicsCensus: {
        r1v2: 'astrosat/isolation_plus/age_census/r1v2',
      },
      ageDemographicsONS: {
        r2v1: 'astrosat/isolation_plus/age_ons/r2v1',
      },
      ahah: {
        v1: 'astrosat/isolation_plus/ahah/v1',
        v2: 'astrosat/isolation_plus/ahah/v2',
        r2v1: 'astrosat/isolation_plus/ahah/r2v1',
      },
      airPollution: {
        r2v1: 'astrosat/isolation_plus/air_pollution/r2v1',
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
      greenspace: {
        r2v1: 'astrosat/isolation_plus/greenspace/r2v1',
      },
      healthVulnerability: {
        r2v1: 'astrosat/isolation_plus/health_vulnerability/r2v1',
      },
      generalHousing: {
        r2v1: 'astrosat/isolation_plus/housing/r2v1',
      },
      imd: {
        r2v1: 'astrosat/isolation_plus/imd/r2v1',
      },
      localFuelPoverty: {
        v1: 'astrosat/isolation_plus/lfp/v1',
        v2: 'astrosat/isolation_plus/lfp/v2',
        r1v3: 'astrosat/isolation_plus/lfp/r1v3',
      },
      mobileConnectivity: {
        v1: 'astrosat/isolation_plus/mobile/v1',
        v2: 'astrosat/isolation_plus/mobile/v2',
      },
      socialIsolation: {
        r2v1: 'astrosat/isolation_plus/social_isolation/r2v1',
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
    mySupplyLynk: {
      latest: 'astrosat/mysupplylynk/orbis/latest',
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
