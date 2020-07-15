import reducer, {
  selectAvailableFilters,
  selectCurrentFilters,
  selectFilteredData,
  addFilters,
  removeFilters,
} from './filters.slice';

describe.skip('filtersSlice', () => {
  describe('reducer', () => {
    describe('addFilters', () => {
      it('adds filters to state when none are applied', () => {
        const state = {};
        const filters = {
          'fruit-bowl': {
            fruit: ['apple'],
          },
        };
        const expected = { filters };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('merges new layer filters with current', () => {
        const state = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple'],
            },
          },
        };
        const filters = {
          'fruit-bowl': {
            fruit: ['banana'],
          },
        };
        const expected = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('merges new properties into layer filters', () => {
        const state = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
          },
        };
        const filters = {
          'fruit-bowl': {
            status: ['fresh'],
          },
        };
        const expected = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
              status: ['fresh'],
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('adds layer filters alongside other layers', () => {
        const state = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
          },
        };
        const filters = {
          cars: {
            engine: ['V8'],
          },
        };
        const expected = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
            cars: {
              engine: ['V8'],
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('merges from two layers', () => {
        const state = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple'],
            },
            cars: {
              engine: ['V8'],
            },
          },
        };
        const filters = {
          'fruit-bowl': {
            fruit: ['banana'],
          },
          cars: {
            engine: ['W12'],
          },
        };
        const expected = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
            cars: {
              engine: ['V8', 'W12'],
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('does not add filters which already exist', () => {
        const state = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple'],
            },
          },
        };
        const filters = {
          'fruit-bowl': { fruit: ['apple', 'banana'] },
        };
        const expected = {
          filters: {
            'fruit-bowl': {
              fruit: ['apple', 'banana'],
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });

      it('adds nested filter properties', () => {
        const state = {
          filters: {
            people: {
              a: {
                nested: {
                  property: ['value 1'],
                },
              },
            },
          },
        };
        const filters = {
          people: { a: { nested: { property: ['value 2'] } } },
        };
        const expected = {
          filters: {
            people: {
              a: {
                nested: {
                  property: ['value 1', 'value 2'],
                },
              },
            },
          },
        };
        const result = reducer(state, addFilters(filters));
        expect(result).toEqual(expected);
      });
    });

    describe('removeFilters', () => {
      it('removes single values from a single property', () => {
        const state = { filters: { cars: { engine: ['V8', 'V12'] } } };
        const toRemove = { cars: { engine: ['V8'] } };
        const expected = { filters: { cars: { engine: ['V12'] } } };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes multiple values from a single property', () => {
        const state = { filters: { cars: { engine: ['V6', 'V8', 'V12'] } } };
        const toRemove = { cars: { engine: ['V6', 'V12'] } };
        const expected = { filters: { cars: { engine: ['V8'] } } };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes multiple values from multiple properties', () => {
        const state = {
          filters: {
            cars: {
              make: ['BMW', 'Mercedes', 'Lamborghini'],
              engine: ['V6', 'V8', 'V12'],
            },
          },
        };
        const toRemove = {
          cars: { engine: ['V6', 'V12'], make: ['Mercedes', 'Lamborghini'] },
        };
        const expected = {
          filters: { cars: { engine: ['V8'], make: ['BMW'] } },
        };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes multiple properties from multiple layers', () => {
        const state = {
          filters: {
            fruit: {
              type: ['citrus', 'berry', 'tropical'],
              status: ['unripe', 'fresh', 'rotten'],
            },
            cars: {
              make: ['BMW', 'Mercedes', 'Lamborghini'],
              engine: ['V6', 'V8', 'V12'],
            },
          },
        };
        const toRemove = {
          cars: { engine: ['V6', 'V12'], make: ['Mercedes', 'Lamborghini'] },
          fruit: { type: ['citrus', 'tropical'], status: ['unripe', 'rotten'] },
        };
        const expected = {
          filters: {
            cars: { engine: ['V8'], make: ['BMW'] },
            fruit: { type: ['berry'], status: ['fresh'] },
          },
        };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('does not fail if a filter cannot be found', () => {
        const state = { filters: { cars: { make: ['BMW'] } } };
        const toRemove = { cars: { make: ['Mercedes'] } };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(state);
      });

      it('removes properties if no values are left', () => {
        const state = { filters: { cars: { make: ['BMW'], engine: ['V8'] } } };
        const toRemove = { cars: { make: ['BMW'] } };
        const expected = { filters: { cars: { engine: ['V8'] } } };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes layers if no properties are left', () => {
        const state = { filters: { cars: { make: ['BMW'] } } };
        const toRemove = { cars: { make: ['BMW'] } };
        const expected = { filters: {} };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes filter values from nested properties', () => {
        const state = {
          filters: {
            people: { 'a.nested.property': ['value 1', 'value 2'] },
          },
        };
        const toRemove = { people: { 'a.nested.property': ['value 2'] } };
        const expected = {
          filters: { people: { 'a.nested.property': ['value 1'] } },
        };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });

      it('removes nested properties when no filters are left', () => {
        const state = {
          filters: {
            people: { 'a.nested.property': ['value 1'] },
          },
        };
        const toRemove = { people: { 'a.nested.property': ['value 1'] } };
        const expected = { filters: {} };
        const result = reducer(state, removeFilters(toRemove));
        expect(result).toEqual(expected);
      });
    });
  });

  describe('selectors', () => {
    describe('selectAvailableFilters', () => {
      it('returns the filters with options based on the current user selected layers', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('only returns unique options', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('returns filter sections for each selected layer', () => {
        const state = {
          data: {
            layers: ['fruit-bowl', 'cars'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
              {
                source_id: 'cars',
                metadata: {
                  filters: ['make'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        make: 'BMW',
                      },
                    },
                    {
                      properties: {
                        make: 'Porsche',
                      },
                    },
                    {
                      properties: {
                        make: 'Lada',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          cars: {
            make: ['BMW', 'Porsche', 'Lada'],
          },
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('returns options for each filterable property', () => {
        const state = {
          data: {
            layers: ['cars'],
            sources: [
              {
                source_id: 'cars',
                metadata: {
                  filters: ['make', 'engine'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        make: 'BMW',
                        engine: 'Straight 6',
                      },
                    },
                    {
                      properties: {
                        make: 'Porsche',
                        engine: 'Flat 4',
                      },
                    },
                    {
                      properties: {
                        make: 'Lada',
                        engine: 'Hamster',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          cars: {
            make: ['BMW', 'Porsche', 'Lada'],
            engine: ['Straight 6', 'Flat 4', 'Hamster'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('returns an empty object if the user has not selected layers', () => {
        const state = {
          data: {
            layers: [],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('returns an empty object if there are no sources available', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('returns an empty object if there are sources but non are filterable', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {},
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual({});
      });

      it('does not include a filter if it is specified but does not match to a property', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit', 'status'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('does not fail if a feature does not contain the filterable property', () => {
        const state = {
          data: {
            layers: ['fruit-bowl'],
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['fruit', 'status'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                        status: 'fresh',
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                        status: 'rotten',
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'fruit-bowl': {
            fruit: ['apple', 'banana', 'orange'],
            status: ['fresh', 'rotten'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('works on grouped properties', () => {
        const state = {
          data: {
            layers: ['people'],
            sources: [
              {
                source_id: 'people',
                metadata: {
                  filters: ['contactDetails.country'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        contactDetails: {
                          country: 'Scotland',
                        },
                      },
                    },
                    {
                      properties: {
                        contactDetails: {
                          country: 'Wales',
                        },
                      },
                    },
                    {
                      properties: {
                        contactDetails: {
                          country: 'Scotland',
                        },
                      },
                    },
                    {
                      properties: {
                        contactDetails: {
                          country: 'England',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          people: {
            'contactDetails.country': ['Scotland', 'Wales', 'England'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('works on array properties', () => {
        const state = {
          data: {
            layers: ['people'],
            sources: [
              {
                source_id: 'people',
                metadata: {
                  filters: ['favouriteAnimals'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        favouriteAnimals: ['dog', 'cat'],
                      },
                    },
                    {
                      properties: {
                        favouriteAnimals: ['aardvark'],
                      },
                    },
                    {
                      properties: {
                        favouriteAnimals: ['shark', 'dog', 'aardvark'],
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          people: {
            favouriteAnimals: ['dog', 'cat', 'aardvark', 'shark'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('works on a mix of grouped, arrays, and singles', () => {
        const state = {
          data: {
            layers: ['people'],
            sources: [
              {
                source_id: 'people',
                metadata: {
                  filters: [
                    'contactDetails.country',
                    'favouriteAnimal',
                    'information.requires',
                  ],
                },
                data: {
                  features: [
                    {
                      properties: {
                        contactDetails: {
                          country: 'Scotland',
                        },
                        favouriteAnimal: 'dog',
                        information: {
                          requires: ['food', 'shelter'],
                        },
                      },
                    },
                    {
                      properties: {
                        contactDetails: {
                          country: 'Scotland',
                        },
                        favouriteAnimal: 'cat',
                        information: {
                          requires: ['food', 'water'],
                        },
                      },
                    },
                    {
                      properties: {
                        contactDetails: {
                          country: 'England',
                        },
                        favouriteAnimal: 'cat',
                        information: {
                          requires: ['water'],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          people: {
            'contactDetails.country': ['Scotland', 'England'],
            favouriteAnimal: ['dog', 'cat'],
            'information.requires': ['food', 'shelter', 'water'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('works on super nested objects', () => {
        const state = {
          data: {
            layers: ['nesting-test'],
            sources: [
              {
                source_id: 'nesting-test',
                metadata: {
                  filters: [
                    'this.is.a.super.nested.property',
                    'this.is.a.super.nested.array',
                  ],
                },
                data: {
                  features: [
                    {
                      properties: {
                        this: {
                          is: {
                            a: {
                              super: {
                                nested: {
                                  property: 'value 1',
                                  array: ['arr val 1', 'arr val 2'],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      properties: {
                        this: {
                          is: {
                            a: {
                              super: {
                                nested: {
                                  property: 'value 2',
                                  array: ['arr val 2', 'arr val 3'],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'nesting-test': {
            'this.is.a.super.nested.property': ['value 1', 'value 2'],
            'this.is.a.super.nested.array': [
              'arr val 1',
              'arr val 2',
              'arr val 3',
            ],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });

      it('returns filters for all properties of a group if a group key is specified as a filter', () => {
        const state = {
          data: {
            layers: ['availability-test'],
            sources: [
              {
                source_id: 'availability-test',
                metadata: {
                  filters: ['Availability'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        Availability: {
                          Saturday: ['Afternoon'],
                          Sunday: ['Evening'],
                          Monday: ['Morning'],
                          Tuesday: ['Afternoon'],
                          Thursday: ['Afternoon'],
                          Friday: ['Morning'],
                        },
                      },
                    },
                    {
                      properties: {
                        Availability: {
                          Saturday: ['Morning', 'Afternoon', 'Evening'],
                          Sunday: [],
                          Monday: ['Morning'],
                          Tuesday: ['Afternoon'],
                          Wednesday: ['Evening'],
                          Thursday: [],
                          Friday: [],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        const expected = {
          'availability-test': {
            'Availability.Saturday': ['Afternoon', 'Morning', 'Evening'],
            'Availability.Sunday': ['Evening'],
            'Availability.Monday': ['Morning'],
            'Availability.Tuesday': ['Afternoon'],
            'Availability.Wednesday': ['Evening'],
            'Availability.Thursday': ['Afternoon'],
            'Availability.Friday': ['Morning'],
          },
        };
        const result = selectAvailableFilters(state);
        expect(result).toEqual(expected);
      });
    });

    describe('selectCurrentFilters', () => {
      it('should return the filters from state', () => {
        const state = {
          data: {
            filters: {
              layer: {
                property: ['one', 'two'],
              },
            },
          },
        };
        const result = selectCurrentFilters(state);
        expect(result).toEqual(state.data.filters);
      });

      it('should return an empty object if no state is present', () => {
        const state = {};
        const result = selectCurrentFilters(state);
        expect(result).toEqual({});
      });

      it('should return an empty object if no filters are present', () => {
        const state = {
          data: {},
        };
        const result = selectCurrentFilters(state);
        expect(result).toEqual({});
      });
    });

    describe('selectFilteredData', () => {
      let sources;

      beforeEach(() => {
        sources = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
                {
                  properties: {
                    fruit: 'banana',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'banana',
                    status: 'rotten',
                  },
                },
                {
                  properties: {
                    fruit: 'orange',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'orange',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'Straight 6',
                  },
                },
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V8',
                  },
                },
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V10',
                  },
                },
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'Straight 6',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'V8',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Lamborghini',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Lamborghini',
                    engine: 'V10',
                  },
                },
              ],
            },
          },
        ];
      });

      it('handles single layer property value filters', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple values', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple', 'banana'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
                {
                  properties: {
                    fruit: 'banana',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'banana',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple properties', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
                status: ['rotten'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple layers', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl', 'cars'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
              },
              cars: {
                engine: ['V8'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V8',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'V8',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple values over multiple layers', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl', 'cars'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple', 'orange'],
              },
              cars: {
                engine: ['V10', 'V12'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },
                {
                  properties: {
                    fruit: 'orange',
                    status: 'fresh',
                  },
                },
                {
                  properties: {
                    fruit: 'orange',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V10',
                  },
                },
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Lamborghini',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Lamborghini',
                    engine: 'V10',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple properties on multiple layers', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl', 'cars'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
                status: ['fresh'],
              },
              cars: {
                make: ['BMW'],
                engine: ['V12'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                  },
                },
              ],
            },
          },
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V12',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('handles filtering multiple values over multiple properties over multiple layers', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl', 'cars'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple', 'orange'],
                status: ['rotten'],
              },
              cars: {
                make: ['BMW', 'Mercedes', 'Lamborghini'],
                engine: ['V12'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['fruit', 'status'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                  },
                },

                {
                  properties: {
                    fruit: 'orange',
                    status: 'rotten',
                  },
                },
              ],
            },
          },
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'V12',
                  },
                },

                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'V12',
                  },
                },
                {
                  properties: {
                    make: 'Lamborghini',
                    engine: 'V12',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('includes unfiltered data for a layer if no filters are applied', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl', 'cars'],
            filters: {
              cars: {
                engine: ['Straight 6'],
              },
            },
          },
        };
        const expected = [
          sources[0],
          {
            source_id: 'cars',
            metadata: {
              filters: ['make', 'engine'],
            },
            data: {
              features: [
                {
                  properties: {
                    make: 'BMW',
                    engine: 'Straight 6',
                  },
                },
                {
                  properties: {
                    make: 'Mercedes',
                    engine: 'Straight 6',
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
        expect(state.sources).not.toEqual(result);
      });

      it('returns all unfiltered data if no filters are present', () => {
        const state = {
          data: { sources, layers: ['fruit-bowl', 'cars'] },
        };
        const result = selectFilteredData(state);
        expect(result).toEqual(sources);
      });

      it('returns all unfiltered data if no filters are applied', () => {
        const state = {
          data: { sources, layers: ['fruit-bowl', 'cars'], filters: {} },
        };
        const result = selectFilteredData(state);
        expect(result).toEqual(sources);
      });

      it('returns unfiltered data for a layer if the layer is present but no filters are', () => {
        const state = {
          data: {
            sources,
            layers: ['fruit-bowl'],
            filters: {
              'fruit-bowl': {},
            },
          },
        };
        const expected = [sources[0]];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
      });

      it('returns unfiltered data for a layer if a filter is present but has no value', () => {
        const state = {
          data: {
            sources,
            layers: ['cars'],
            filters: {
              cars: {
                engine: [],
              },
            },
          },
        };
        const expected = [sources[1]];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
      });

      it('returns an empty array if no state is present', () => {
        const state = {};
        const result = selectFilteredData(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if no sources are present', () => {
        const state = {
          data: {
            layers: ['fruit-bowl', 'cars'],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
              },
              cars: {
                make: ['BMW'],
              },
            },
          },
        };
        const result = selectFilteredData(state);
        expect(result).toEqual([]);
      });

      it('returns an empty array if no layers are selected', () => {
        const state = {
          data: {
            sources,
            layers: [],
            filters: {
              'fruit-bowl': {
                fruit: ['apple'],
              },
              cars: {
                make: ['BMW'],
              },
            },
          },
        };
        const result = selectFilteredData(state);
        expect(result).toEqual([]);
      });

      it('works with nested properties', () => {
        const state = {
          data: {
            sources: [
              {
                source_id: 'fruit-bowl',
                metadata: {
                  filters: ['nested.property'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        fruit: 'apple',
                        status: 'fresh',
                        nested: {
                          property: 'value 1',
                        },
                      },
                    },
                    {
                      properties: {
                        fruit: 'apple',
                        status: 'rotten',
                        nested: {
                          property: 'value 2',
                        },
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                        status: 'fresh',
                        nested: {
                          property: 'value 2',
                        },
                      },
                    },
                    {
                      properties: {
                        fruit: 'banana',
                        status: 'rotten',
                        nested: {
                          property: 'value 3',
                        },
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                        status: 'fresh',
                        nested: {
                          property: 'value 1',
                        },
                      },
                    },
                    {
                      properties: {
                        fruit: 'orange',
                        status: 'rotten',
                        nested: {
                          property: 'value 3',
                        },
                      },
                    },
                  ],
                },
              },
            ],
            layers: ['fruit-bowl'],
            filters: {
              'fruit-bowl': {
                'nested.property': ['value 1', 'value 2'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'fruit-bowl',
            metadata: {
              filters: ['nested.property'],
            },
            data: {
              features: [
                {
                  properties: {
                    fruit: 'apple',
                    status: 'fresh',
                    nested: {
                      property: 'value 1',
                    },
                  },
                },
                {
                  properties: {
                    fruit: 'apple',
                    status: 'rotten',
                    nested: {
                      property: 'value 2',
                    },
                  },
                },
                {
                  properties: {
                    fruit: 'banana',
                    status: 'fresh',
                    nested: {
                      property: 'value 2',
                    },
                  },
                },
                {
                  properties: {
                    fruit: 'orange',
                    status: 'fresh',
                    nested: {
                      property: 'value 1',
                    },
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
      });

      it('works with array properties', () => {
        const state = {
          data: {
            sources: [
              {
                source_id: 'array-test',
                metadata: {
                  filters: ['arrayproperty'],
                },
                data: {
                  features: [
                    {
                      properties: {
                        arrayproperty: ['value 1', 'value 2'],
                      },
                    },
                    {
                      properties: {
                        arrayproperty: ['value 3', 'value 4'],
                      },
                    },
                    {
                      properties: {
                        arrayproperty: ['value 1', 'value 5'],
                      },
                    },
                  ],
                },
              },
            ],
            layers: ['array-test'],
            filters: {
              'array-test': {
                arrayproperty: ['value 1', 'value 5'],
              },
            },
          },
        };
        const expected = [
          {
            source_id: 'array-test',
            metadata: {
              filters: ['arrayproperty'],
            },
            data: {
              features: [
                {
                  properties: {
                    arrayproperty: ['value 1', 'value 2'],
                  },
                },
                {
                  properties: {
                    arrayproperty: ['value 1', 'value 5'],
                  },
                },
              ],
            },
          },
        ];
        const result = selectFilteredData(state);
        expect(result).toEqual(expected);
      });
    });
  });
});
