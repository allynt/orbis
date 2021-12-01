import {
  injectSource,
  createCategorisationPath,
  createOrbsWithCategorisedSources,
  collectSourceIds,
  createHierarchy,
} from './categorisation.utils';

describe('createCategorisationPath', () => {
  it('Returns one category with no delimiters if one category is given', () => {
    const result = createCategorisationPath({
      categories: { name: 'Category' },
    });
    expect(result).toBe('Category');
  });

  it('Returns two categories separated by a delimiter', () => {
    const result = createCategorisationPath({
      categories: {
        name: 'Cat1',
        child: { name: 'Cat2' },
      },
    });
    expect(result).toBe('Cat1.Cat2');
  });

  it('Includes the current path if supplied', () => {
    const result = createCategorisationPath({
      categories: { name: 'Cat1' },
      currentPath: 'Existing',
    });
    expect(result).toBe('Existing.Cat1');
  });

  it('Works to lots of levels', () => {
    const cats = ['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5'];
    const categories = [...cats].reverse().reduce(
      (child, name) => ({
        name,
        child,
      }),
      undefined,
    );
    // @ts-ignore
    const result = createCategorisationPath({ categories });
    expect(result).toBe(cats.join('.'));
  });

  describe('limits the depth of the categorisation path if given', () => {
    const cats = ['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5'];
    it.each`
      depth | expected
      ${1}  | ${cats.slice(0, 1)[0]}
      ${2}  | ${cats.slice(0, 2).join('.')}
      ${3}  | ${cats.slice(0, 3).join('.')}
      ${4}  | ${cats.slice(0, 4).join('.')}
      ${5}  | ${cats.slice(0, 5).join('.')}
      ${6}  | ${cats.slice(0, 6).join('.')}
    `('$depth', ({ depth, expected }) => {
      const categories = [...cats].reverse().reduce(
        (child, name) => ({
          name,
          child,
        }),
        undefined,
      );
      // @ts-ignore
      const result = createCategorisationPath({ categories, depth });
      expect(result).toBe(expected);
    });
  });
});

describe('createHierarchy', () => {
  it("creates a category hierarchy from a source's categories", () => {
    const source = {
      source_id: 'source/1',
    };

    const expected = {
      category: 'Cat 1',
      sources: [source],
    };

    const result = createHierarchy(source, ['Cat 1']);
    expect(result).toEqual(expected);
  });

  it('creates the hierarchy to multiple depths', () => {
    const source = {
      source_id: 'source/1',
    };

    const expected = {
      category: 'Cat 1',
      sources: [
        {
          category: 'Cat 2',
          sources: [{ category: 'Cat 3', sources: [source] }],
        },
      ],
    };

    const result = createHierarchy(
      source,
      ['Cat 1', 'Cat 2', 'Cat 3'].slice().reverse(),
    );
    expect(result).toEqual(expected);
  });
});

describe('injectSource', () => {
  describe("puts a source into a category's sources", () => {
    it('single level', () => {
      const categorisedSources = [
        { category: 'Cat 1', sources: [{ source_id: 'cat/1/source/1' }] },
      ];
      const source = { source_id: 'cat/1/source/2' };
      const categoriesPath = ['Cat 1'];
      const expected = [
        {
          category: 'Cat 1',
          sources: [
            { source_id: 'cat/1/source/1' },
            { source_id: 'cat/1/source/2' },
          ],
        },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });

    it('multi level', () => {
      const categorisedSources = [
        {
          category: 'Cat 1',
          sources: [
            { category: 'Cat 2', sources: [{ source_id: 'cat/1/source/1' }] },
          ],
        },
      ];
      const source = { source_id: 'cat/1/source/2' };
      const categoriesPath = ['Cat 1', 'Cat 2'];
      const expected = [
        {
          category: 'Cat 1',
          sources: [
            {
              category: 'Cat 2',
              sources: [
                { source_id: 'cat/1/source/1' },
                { source_id: 'cat/1/source/2' },
              ],
            },
          ],
        },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });
  });

  describe('Adds another category if the source has more categorisation', () => {
    const categorisedSources = [
      {
        category: 'Cat 1',
        sources: [{ source_id: 'cat/1/source/1' }],
      },
    ];
    const source = { source_id: 'cat/2/source/1' };

    it('single level', () => {
      const categoriesPath = ['Cat 2'];
      const expected = [
        {
          category: 'Cat 1',
          sources: [{ source_id: 'cat/1/source/1' }],
        },
        { category: 'Cat 2', sources: [{ source_id: 'cat/2/source/1' }] },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });

    it('multi-level', () => {
      const categoriesPath = ['Cat 1', 'Cat 2', 'Cat 3'];
      const expected = [
        {
          category: 'Cat 1',
          sources: [
            {
              category: 'Cat 2',
              sources: [
                {
                  category: 'Cat 3',
                  sources: [{ source_id: 'cat/2/source/1' }],
                },
              ],
            },
            { source_id: 'cat/1/source/1' },
          ],
        },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });
  });

  describe('adds to adjacent categories', () => {
    it('single level', () => {
      const categorisedSources = [
        {
          category: 'Cat 1',
          sources: [
            { source_id: 'cat/1/source/1' },
            { source_id: 'cat/1/source/3' },
          ],
        },
        { category: 'Cat 2', sources: [{ source_id: 'cat/2/source/1' }] },
      ];
      const categoriesPath = ['Cat 2'];
      const source = { source_id: 'cat/2/source/2' };
      const expected = [
        {
          category: 'Cat 1',
          sources: [
            { source_id: 'cat/1/source/1' },
            { source_id: 'cat/1/source/3' },
          ],
        },
        {
          category: 'Cat 2',
          sources: [
            { source_id: 'cat/2/source/1' },
            { source_id: 'cat/2/source/2' },
          ],
        },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });

    it('multi level', () => {
      const categorisedSources = [
        {
          category: 'Cat 1',
          sources: [
            { source_id: 'cat/1/source/1' },
            { source_id: 'cat/1/source/3' },
          ],
        },
        {
          category: 'Cat 2',
          sources: [
            { category: 'Cat 3', sources: [{ source_id: 'cat/2/source/1' }] },
          ],
        },
      ];
      const categoriesPath = ['Cat 2', 'Cat 3'];
      const source = { source_id: 'cat/2/source/2' };
      const expected = [
        {
          category: 'Cat 1',
          sources: [
            { source_id: 'cat/1/source/1' },
            { source_id: 'cat/1/source/3' },
          ],
        },
        {
          category: 'Cat 2',
          sources: [
            {
              category: 'Cat 3',
              sources: [
                { source_id: 'cat/2/source/1' },
                { source_id: 'cat/2/source/2' },
              ],
            },
          ],
        },
      ];
      const result = injectSource(categorisedSources, source, categoriesPath);
      expect(result).toEqual(expected);
    });
  });
});

describe('createOrbsWithCategorisedSources', () => {
  it('returns all sources organised by orb and category', () => {
    const sources = [
      {
        source_id: 'orb/1/source/1',
        metadata: {
          application: {
            orbis: {
              categories: { name: 'Orb 1 Category 1' },
              orbs: [{ name: 'Orb 1' }],
            },
          },
        },
      },
      {
        source_id: 'orb/1/source/2',
        metadata: {
          application: {
            orbis: {
              categories: { name: 'Orb 1 Category 2' },
              orbs: [{ name: 'Orb 1' }],
            },
          },
        },
      },
      {
        source_id: 'orb/1/source/3',
        metadata: {
          application: {
            orbis: {
              categories: { name: 'Orb 1 Category 1' },
              orbs: [{ name: 'Orb 1' }],
            },
          },
        },
      },
      {
        source_id: 'orb/1/source/4',
        metadata: {
          application: {
            orbis: {
              categories: { name: 'Orb 1 Category 2' },
              orbs: [{ name: 'Orb 1' }],
            },
          },
        },
      },
    ];

    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Orb 1 Category 1',
            sources: [
              expect.objectContaining({
                source_id: 'orb/1/source/1',
              }),
              expect.objectContaining({
                source_id: 'orb/1/source/3',
              }),
            ],
          },
          {
            category: 'Orb 1 Category 2',
            sources: [
              expect.objectContaining({
                source_id: 'orb/1/source/2',
              }),
              expect.objectContaining({
                source_id: 'orb/1/source/4',
              }),
            ],
          },
        ],
      },
    ];

    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });

  it('handles nested categories', () => {
    const sources = [
      {
        source_id: 'source/1',
        metadata: {
          application: {
            orbis: {
              categories: {
                name: 'Cat 1',
                child: {
                  name: 'Cat 2',
                  child: {
                    name: 'Cat 3',
                  },
                },
              },
              orbs: [{ name: 'Orb 1' }],
            },
          },
        },
      },
    ];

    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Cat 1',
            sources: [
              {
                category: 'Cat 2',
                sources: [{ category: 'Cat 3', sources: [sources[0]] }],
              },
            ],
          },
        ],
      },
    ];
    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });

  it('handles multiple orbs', () => {
    const sources = [
      {
        source_id: 'Source 1',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 1' }],
              categories: {
                name: 'Category 1',
              },
            },
          },
        },
      },
      {
        source_id: 'Source 2',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 2' }],
              categories: {
                name: 'Category 2',
                child: { name: 'Category 3' },
              },
            },
          },
        },
      },
    ];

    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Category 1',
            sources: [
              expect.objectContaining({
                source_id: 'Source 1',
              }),
            ],
          },
        ],
      },
      {
        name: 'Orb 2',
        sources: [
          {
            category: 'Category 2',
            sources: [
              {
                category: 'Category 3',
                sources: [
                  expect.objectContaining({
                    source_id: 'Source 2',
                  }),
                ],
              },
            ],
          },
        ],
      },
    ];
    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });

  it('handles sources with multiple orbs', () => {
    const sources = [
      {
        source_id: 'Source 1',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 1' }, { name: 'Orb 2' }],
              categories: {
                name: 'Category 1',
                child: {
                  name: 'Category 2',
                },
              },
            },
          },
        },
      },
    ];

    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Category 1',
            sources: [
              {
                category: 'Category 2',
                sources: [
                  expect.objectContaining({
                    source_id: 'Source 1',
                  }),
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Orb 2',
        sources: [
          {
            category: 'Category 1',
            sources: [
              {
                category: 'Category 2',
                sources: [
                  expect.objectContaining({
                    source_id: 'Source 1',
                  }),
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });

  it('Only includes sources once if ignoreMultipleOrbs is true', () => {
    const sources = [
      {
        source_id: 'test/source/1',
        metadata: {
          application: {
            orbis: {
              categories: {
                name: 'Cat 1',
                child: {
                  name: 'Cat 2',
                  child: {
                    name: 'Cat 3',
                  },
                },
              },
              orbs: [
                {
                  name: 'Orb 1',
                },
                {
                  name: 'Orb 2',
                },
              ],
            },
          },
        },
      },
    ];
    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Cat 1',
            sources,
          },
        ],
      },
    ];
    const result = createOrbsWithCategorisedSources(sources, null, true);
    expect(result).toEqual(expected);
  });

  it('filters out dashboard sources', () => {
    const dashboardSource = {
        source_id: 'test/source/2',
        metadata: {
          application: {
            orbis: { dashboard_component: {} },
          },
        },
      },
      nonDashboardSource = {
        source_id: 'test/source/1',
        metadata: {
          application: {
            orbis: {
              categories: {
                name: 'Cat 1',
                child: {
                  name: 'Cat 2',
                  child: {
                    name: 'Cat 3',
                  },
                },
              },
              orbs: [
                {
                  name: 'Orb 1',
                },
                {
                  name: 'Orb 2',
                },
              ],
            },
          },
        },
      };

    const sources = [nonDashboardSource, dashboardSource];

    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Cat 1',
            sources: [nonDashboardSource],
          },
        ],
      },
    ];

    const result = createOrbsWithCategorisedSources(sources, null, true);
    expect(result).toEqual(expected);
  });

  describe('puts sources without a category into the root level', () => {
    it.each`
      tag               | value
      ${'undefined'}    | ${undefined}
      ${'empty object'} | ${{}}
    `('$tag', ({ value }) => {
      const sources = [
        {
          source_id: 'orb/1/source/1',
          metadata: {
            application: {
              orbis: {
                orbs: [{ name: 'Orb 1' }],
                categories: value,
              },
            },
          },
        },
      ];
      /** @type {import('typings').OrbWithCategorisedSources[]} */
      const expected = [
        {
          name: 'Orb 1',
          sources: expect.arrayContaining([
            expect.objectContaining({
              source_id: 'orb/1/source/1',
            }),
          ]),
        },
      ];
      const result = createOrbsWithCategorisedSources(sources);
      expect(result).toEqual(expected);
    });

    it('injected', () => {
      const sources = [
        {
          source_id: 'orb/1/source/2',
          metadata: {
            application: {
              orbis: {
                orbs: [{ name: 'Orb 1' }],
                categories: { name: 'Cat1' },
              },
            },
          },
        },
        {
          source_id: 'orb/1/source/1',
          metadata: {
            application: { orbis: { orbs: [{ name: 'Orb 1' }] } },
          },
        },
      ];
      const expected = [
        {
          name: 'Orb 1',
          sources: expect.arrayContaining([
            expect.objectContaining({ source_id: 'orb/1/source/1' }),
          ]),
        },
      ];
      const result = createOrbsWithCategorisedSources(sources);
      expect(result).toEqual(expected);
    });
  });

  describe('puts sources without an orb into the "No Orb" orb', () => {
    it.each`
      tag             | value
      ${'emptyArray'} | ${[]}
      ${'undefined'}  | ${undefined}
    `('$tag', value => {
      const sources = [
        {
          source_id: 'orb/1/source/1',
          metadata: {
            application: {
              orbis: {
                orbs: value,
                categories: { name: 'Billy no mates' },
              },
            },
          },
        },
      ];
      /** @type {import('typings').OrbWithCategorisedSources[]} */
      const expected = expect.arrayContaining([
        {
          name: 'No Orb',
          sources: [
            {
              category: 'Billy no mates',
              sources: [
                expect.objectContaining({
                  source_id: 'orb/1/source/1',
                }),
              ],
            },
          ],
        },
      ]);

      const result = createOrbsWithCategorisedSources(sources);
      expect(result).toEqual(expected);
    });
  });

  describe('returns sources categorised to a depth', () => {
    const sources = [
      {
        source_id: 'source/1',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 1' }],
              categories: {
                name: 'Cat 1',
                child: { name: 'Cat 2', child: { name: 'Cat 3' } },
              },
            },
          },
        },
      },
      {
        source_id: 'source/2',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 1' }],
              categories: {
                name: 'Cat 1',
                child: { name: 'Cat 2' },
              },
            },
          },
        },
      },
      {
        source_id: 'source/3',
        metadata: {
          application: {
            orbis: {
              orbs: [{ name: 'Orb 1' }],
              categories: {
                name: 'Cat 1',
              },
            },
          },
        },
      },
    ];

    const depth1 = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Cat 1',
            sources: [
              expect.objectContaining({ source_id: 'source/1' }),
              expect.objectContaining({ source_id: 'source/2' }),
              expect.objectContaining({ source_id: 'source/3' }),
            ],
          },
        ],
      },
    ];

    const depth2 = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Cat 1',
            sources: [
              {
                category: 'Cat 2',
                sources: [
                  expect.objectContaining({ source_id: 'source/1' }),
                  expect.objectContaining({ source_id: 'source/2' }),
                ],
              },
              expect.objectContaining({ source_id: 'source/3' }),
            ],
          },
        ],
      },
    ];

    it.each`
      depth | expected
      ${1}  | ${depth1}
      ${2}  | ${depth2}
    `('$depth', ({ depth, expected }) => {
      expect(createOrbsWithCategorisedSources(sources, depth)).toEqual(
        expected,
      );
    });
  });
});

describe('collectSourceIds', () => {
  it('returns all the source ids from a flat hierarchy', () => {
    const categorisedSources = [
      { source_id: 'source/1' },
      { source_id: 'source/2' },
      { source_id: 'source/3' },
    ];
    const result = collectSourceIds(categorisedSources);
    expect(result).toEqual(['source/1', 'source/2', 'source/3']);
  });

  it('returns all source ids from a nested hierarchy', () => {
    const categorisedSources = [
      {
        category: 'Forestry',
        sources: [
          {
            source_id: 'forestry/1',
          },
          {
            category: 'Trees',
            sources: [
              { source_id: 'trees/1' },
              { source_id: 'trees/2' },
              { category: 'Evergreen', sources: [{ source_id: 'pine/1' }] },
            ],
          },
        ],
      },
    ];

    const result = collectSourceIds(categorisedSources);
    expect(result).toEqual(['forestry/1', 'trees/1', 'trees/2', 'pine/1']);
  });

  it('returns all source ids from a sibling hierarchy', () => {
    const categorisedSources = [
      {
        category: 'Forestry',
        sources: [{ source_id: 'forestry/1' }, { source_id: 'forestry/2' }],
      },
      {
        category: 'Health',
        sources: [{ source_id: 'health/1' }, { source_id: 'health/2' }],
      },
    ];
    const result = collectSourceIds(categorisedSources);
    expect(result).toEqual([
      'forestry/1',
      'forestry/2',
      'health/1',
      'health/2',
    ]);
  });
});
