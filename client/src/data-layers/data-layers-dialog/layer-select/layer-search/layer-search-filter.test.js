import { layerSearchFilter } from './layer-search-filter';

const orbs = [
  {
    metadata: {
      label: 'frozen offset ignite',
      description: 'crime execute feeling',
    },
  },
  {
    metadata: {
      label: 'hotdog formula control',
      description: 'flood frighten class',
    },
  },
  {
    metadata: {
      label: 'rehearsal horn discipline',
      description: 'orange writer separate',
    },
  },
  {
    metadata: {
      label: 'rich knit version',
      description: 'threat terrify sculpture',
    },
  },
  {
    metadata: {
      label: 'ACT REMEMBER DIVE',
      description: 'MAKE ROLE FUNERAL',
    },
  },
];

describe('layerSearchFilter', () => {
  it('filters sources based on search term', () => {
    const result = layerSearchFilter(orbs, 'ignite');

    const expected = [
      {
        metadata: {
          label: 'frozen offset ignite',
          description: 'crime execute feeling',
        },
      },
    ];

    expect(result).toEqual(expected);
  });

  it('searches all specified fields', () => {
    const result = layerSearchFilter(orbs, 'crime');

    const expected = [
      {
        metadata: {
          label: 'frozen offset ignite',
          description: 'crime execute feeling',
        },
      },
    ];

    expect(result).toEqual(expected);
  });

  it('returns undefined if no orbs', () => {
    const result = layerSearchFilter(undefined, 'search term');
    expect(result).toEqual(undefined);
  });

  it('returns undefined if no search term', () => {
    const result = layerSearchFilter(orbs, undefined);
    expect(result).toEqual(undefined);
  });

  it('is case insensitive', () => {
    const result = layerSearchFilter(orbs, 'dive');

    const expected = [
      {
        metadata: {
          label: 'ACT REMEMBER DIVE',
          description: 'MAKE ROLE FUNERAL',
        },
      },
    ];

    expect(result).toEqual(expected);
  });
});
