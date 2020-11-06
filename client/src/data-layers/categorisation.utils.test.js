import {
  injectSource,
  createCategorisationPath,
  createOrbsWithCategorisedSources,
} from './categorisation.utils';

describe('createCategorisationPath', () => {
  it('Returns one category with no delimiters if one category is given', () => {
    const result = createCategorisationPath({ name: 'Category' });
    expect(result).toBe('Category');
  });

  it('Returns two categories separated by a delimiter', () => {
    const result = createCategorisationPath({
      name: 'Cat1',
      child: { name: 'Cat2' },
    });
    expect(result).toBe('Cat1.Cat2');
  });

  it('Includes the current path if supplied', () => {
    const result = createCategorisationPath({ name: 'Cat1' }, 'Existing');
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
    const result = createCategorisationPath(categories);
    expect(result).toBe(cats.join('.'));
  });
});

describe('createHierarchy', () => {});

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
            { source_id: 'cat/1/source/1' },
            {
              category: 'Cat 2',
              sources: [
                {
                  category: 'Cat 3',
                  sources: [{ source_id: 'cat/2/source/1' }],
                },
              ],
            },
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

describe('', () => {
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
            ],
          },
          {
            category: 'Orb 1 Category 2',
            sources: [
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

  it('puts sources without a category into the Other category', () => {
    const sources = [
      {
        source_id: 'orb/1/source/1',
        metadata: {
          application: { orbis: { orbs: [{ name: 'Orb 1' }] } },
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
    ];
    /** @type {OrbWithCategorisedSources[]} */
    const expected = [
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Other',
            sources: [
              {
                source_id: 'orb/1/source/1',
                metadata: {
                  application: {
                    orbis: {
                      orbs: [{ name: 'Orb 1' }],
                    },
                  },
                },
              },
            ],
          },
          {
            category: 'Orb 1 Category 2',
            sources: [
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
            ],
          },
        ],
      },
    ];
    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });

  it('puts sources without an orb into the "No Orb" orb', () => {
    const sources = [
      {
        source_id: 'orb/1/source/1',
        metadata: {
          application: {
            orbis: { categories: { name: 'Billy no mates' } },
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
    ];
    /** @type {OrbWithCategorisedSources[]} */
    const expected = [
      {
        name: 'No Orb',
        sources: [
          {
            category: 'Billy no mates',
            sources: [
              {
                source_id: 'orb/1/source/1',
                metadata: {
                  application: {
                    orbis: { categories: { name: 'Billy no mates' } },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        name: 'Orb 1',
        sources: [
          {
            category: 'Orb 1 Category 2',
            sources: [
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
            ],
          },
        ],
      },
    ];

    const result = createOrbsWithCategorisedSources(sources);
    expect(result).toEqual(expected);
  });
});
