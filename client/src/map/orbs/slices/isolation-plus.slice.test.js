import reducer, {
  setState,
  setProperty,
  addClickedFeatures,
  removeClickedFeatures,
  propertySelector,
  clickedFeaturesSelector,
  populationTotalSelector,
  householdTotalSelector,
  categoryListSelector,
  aggregationSelector,
  breakdownAggregationSelector,
  timeSeriesAggregationSelector,
} from './isolation-plus.slice';

describe('isolationPlusSlice', () => {
  describe('reducer', () => {
    describe('setState', () => {
      it('sets the state', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: { min: 1, max: 2 },
          clickedFeatures: {},
        });
        const payload = {
          property: { min: 1, max: 2 },
          clickedFeatures: {},
        };

        const result = reducer(state, setState(payload));
        expect(result).toEqual(expected);
      });

      it('sets the state without clickedFeatures', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: {},
          clickedFeatures: undefined,
        });
        const payload = {
          property: {},
        };

        const result = reducer(state, setState(payload));
        expect(result).toEqual(expected);
      });
    });

    describe('setProperty', () => {
      it('sets the property for a source in state if not yet defined', () => {
        const state = { property: {} };
        const expected = expect.objectContaining({
          property: { source_id: 'test/layer', name: 'hello' },
        });
        const payload = { source_id: 'test/layer', name: 'hello' };
        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });

      it('overwrites the property for a source in state if it exists', () => {
        const state = {
          property: { source_id: 'test/layer', name: 'no thanks' },
        };
        const expected = expect.objectContaining({
          property: { source_id: 'test/layer', name: 'hello' },
        });
        const payload = { source_id: 'test/layer', name: 'hello' };

        const result = reducer(state, setProperty(payload));
        expect(result).toEqual(expected);
      });
    });

    describe('addClickedFeatures', () => {
      it("Sets clickedFeatures in state if it's undefined", () => {
        const payload = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 1,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 3,
              },
            },
          },
        ];
        const result = reducer({}, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({ clickedFeatures: payload }),
        );
      });

      it('Combines existing clicked features with the new ones', () => {
        const payload = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 4,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 5,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 6,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 1,
                },
              },
            },
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 2,
                },
              },
            },
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 3,
                },
              },
            },
          ],
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            clickedFeatures: expect.arrayContaining([
              ...state.clickedFeatures,
              ...payload,
            ]),
          }),
        );
      });

      it('Does not duplicate features base on their index property', () => {
        const payload = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 1,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [{ object: { properties: { index: 1 } } }],
        };
        const result = reducer(state, addClickedFeatures(payload));
        expect(result).toEqual(state);
      });
    });

    describe('removeClickedFeatures', () => {
      it('Removes all clickedFeatures from state', () => {
        const payload = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 2,
              },
            },
          },
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: {
              properties: {
                index: 3,
              },
            },
          },
        ];
        const state = {
          clickedFeatures: [
            {
              layer: {
                props: {
                  uniqueIdProperty: 'index',
                },
              },
              object: {
                properties: {
                  index: 1,
                },
              },
            },
            ...payload,
          ],
        };
        const result = reducer(state, removeClickedFeatures(payload));
        expect(result).toEqual(
          expect.objectContaining({
            clickedFeatures: [
              {
                layer: {
                  props: {
                    uniqueIdProperty: 'index',
                  },
                },
                object: { properties: { index: 1 } },
              },
            ],
          }),
        );
      });

      it('Sets clickedFeatures to undefined if all features are removed', () => {
        const feature = [
          {
            layer: {
              props: {
                uniqueIdProperty: 'index',
              },
            },
            object: { properties: { index: 1 } },
          },
        ];
        const result = reducer(
          { clickedFeatures: feature },
          removeClickedFeatures(feature),
        );
        expect(result).toEqual(
          expect.objectContaining({ clickedFeatures: undefined }),
        );
      });
    });
  });

  describe('selectors', () => {
    describe('propertySelector', () => {
      it('returns the property for the specified layer', () => {
        const state = {
          isolationPlus: {
            property: {
              source_id: 'test/layer',
              name: 'hello',
            },
          },
        };
        const result = propertySelector(state);
        expect(result).toEqual(state.isolationPlus.property);
      });

      it('returns undefined if state is undefined', () => {
        const result = propertySelector(undefined);
        expect(result).toBeUndefined();
      });

      it('returns undefined if orbs is undefined', () => {
        const result = propertySelector({});
        expect(result).toBeUndefined();
      });

      it('returns undefined if isolationPlus is undefined', () => {
        const result = propertySelector({ orbs: {} });
        expect(result).toBeUndefined();
      });

      it('returns undefined if the layer is undefined in state', () => {
        const result = propertySelector({ orbs: { isolationPlus: {} } });
        expect(result).toBeUndefined();
      });

      it('returns undefined if source_id is undefined', () => {
        const result = propertySelector({
          orbs: { isolationPlus: { 'test/layer': 'hello' } },
        });
        expect(result).toBeUndefined();
      });
    });

    describe('clickedFeaturesSelector', () => {
      it('returns undefined if isolationPlus state is undefined', () => {
        const state = {};
        const result = clickedFeaturesSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns clickedFeatures from state', () => {
        const clickedFeatures = [
          { name: 'test feature 1' },
          { name: 'test feature 2' },
          { name: 'test feature 3' },
        ];

        const state = { isolationPlus: { clickedFeatures } };

        const result = clickedFeaturesSelector(state);
        expect(result).toEqual(clickedFeatures);
      });
    });

    describe('populationTotalSelector', () => {
      it('returns undefined if clickedFeatures is undefined', () => {
        const state = { isolationPlus: { clickedFeatures: undefined } };

        const result = populationTotalSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns populationTotal of all clickedFeatures in state', () => {
        const clickedFeatures = [
          { object: { properties: { population: 5 } } },
          { object: { properties: { population: 10 } } },
          { object: { properties: { population: 15 } } },
        ];

        const state = { isolationPlus: { clickedFeatures } };

        const populationTotal = populationTotalSelector(state);
        expect(populationTotal).toEqual('30');
      });
    });

    describe('householdTotalSelector', () => {
      it('returns undefined if clickedFeatures is undefined', () => {
        const state = { isolationPlus: { clickedFeatures: undefined } };

        const result = householdTotalSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns householdtotal of all clickedFeatures in state', () => {
        const clickedFeatures = [
          { object: { properties: { households: 7 } } },
          { object: { properties: { households: 10 } } },
          { object: { properties: { households: 12 } } },
        ];

        const state = { isolationPlus: { clickedFeatures } };

        const householdTotal = householdTotalSelector(state);
        expect(householdTotal).toEqual('29');
      });
    });

    describe('categoryListSelector', () => {
      it('returns undefined if property is undefined', () => {
        const state = {
          isolationPlus: { property: undefined, clickedFeatures: [{}, {}] },
        };

        const result = categoryListSelector(state);
        expect(result).toBeUndefined();
      });
      it('returns undefined if clickedFeatures is undefined', () => {
        const state = {
          isolationPlus: {
            property: {
              source_id: 'test/layer',
              name: 'hello',
            },
            clickedFeatures: undefined,
          },
        };

        const result = categoryListSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns categoryList from state', () => {
        const state = {};

        const expected = undefined;

        const result = categoryListSelector(state);
        expect(result).toEqual(expected);
      });
    });

    describe('aggregationSelector', () => {
      it('returns undefined if property is undefined', () => {
        const state = { isolationPlus: {} };

        const result = aggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if clickedFeatures is undefined', () => {
        const state = {
          isolationPlus: {
            property: {
              source_id: 'test/layer',
              name: 'hello',
            },
            clickedFeatures: undefined,
          },
        };

        const result = aggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns areaValue calculated from state', () => {
        const getState = type => ({
          isolationPlus: {
            property: {
              name: '% of people aged 0-17',
              aggregation: type,
              precision: 1,
            },
            clickedFeatures: [
              {
                object: {
                  properties: {
                    '% of people aged 0-17': 12,
                  },
                },
              },
              {
                object: {
                  properties: {
                    '% of people aged 0-17': 15,
                  },
                },
              },
            ],
          },
        });

        const areaValue = aggregationSelector(getState('sum'));
        expect(areaValue).toEqual(27);
      });
    });

    describe('breakdownAggregationSelector', () => {
      it('returns undefined if property is undefined', () => {
        const state = {
          orbs: {
            isolationPlus: {},
          },
        };

        const result = breakdownAggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if clickedFeatures is undefined', () => {
        const state = {
          orbs: {
            isolationPlus: {
              property: {
                source_id: 'test/layer',
                name: 'hello',
              },
            },
          },
        };

        const result = breakdownAggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if breakdown is undefined', () => {
        const state = {
          orbs: {
            isolationPlus: {
              property: {
                source_id: 'test/layer',
                name: 'hello',
              },
              clickedFeatures: [{}],
            },
          },
        };

        const result = breakdownAggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns `breakdownAggregation` from state', () => {
        const source_id = 'test/source',
          state = {
            data: {
              sources: [
                {
                  source_id,
                  metadata: {
                    properties: [
                      { name: '% of people aged 0-17' },
                      { name: '% of people aged 18-39' },
                    ],
                  },
                },
              ],
              layers: [source_id],
            },
            orbs: {
              isolationPlus: {
                property: {
                  source_id,
                  aggregation: 'sum',
                  precision: 1,
                  breakdown: [
                    '% of people aged 0-17',
                    '% of people aged 18-39',
                  ],
                },
                clickedFeatures: [
                  {
                    object: {
                      properties: {
                        '% of people aged 0-17': 2,
                        '% of people aged 18-39': 4,
                      },
                    },
                  },
                  {
                    object: {
                      properties: {
                        '% of people aged 0-17': 5,
                        '% of people aged 18-39': 9,
                      },
                    },
                  },
                ],
              },
            },
          };

        const expected = [
          { value: 7, name: '% of people aged 0-17' },
          { value: 13, name: '% of people aged 18-39' },
        ];

        const result = breakdownAggregationSelector(state);

        expect(result).toEqual(expected);
      });

      it('Returns the breakdown aggregated by latest timestamp if the property is timeseries', () => {
        const name1 = 'people in 0-17',
          name2 = 'people in 18-39',
          timestamp = '2020-02-01T00:00:00Z',
          source_id = 'test/source';

        const state = {
          data: {
            sources: [
              {
                source_id,
                metadata: {
                  properties: [
                    {
                      name: name1,
                      timeseries: true,
                      timeseries_latest_timestamp: timestamp,
                    },
                    {
                      name: name2,
                      timeseries: true,
                      timeseries_latest_timestamp: timestamp,
                    },
                  ],
                },
              },
            ],
            layers: [source_id],
          },
          orbs: {
            isolationPlus: {
              property: {
                source_id,
                name: name1,
                breakdown: [name1, name2],
                timeseries: true,
                timeseries_latest_timestamp: timestamp,
              },
              clickedFeatures: [
                {
                  object: {
                    properties: {
                      [name1]: [{ timestamp, value: 20 }],
                      [name2]: [{ timestamp, value: 4 }],
                    },
                  },
                },
                {
                  object: {
                    properties: {
                      [name1]: [{ timestamp, value: 3 }],
                      [name2]: [{ timestamp, value: 1 }],
                    },
                  },
                },
              ],
            },
          },
        };
        const result = breakdownAggregationSelector(state);
        expect(result).toEqual([
          { value: 23, name: name1 },
          { value: 5, name: name2 },
        ]);
      });

      it('Errors if latest timestamps are not matching between breakdown properties', () => {
        const name1 = 'people in 0-17',
          name2 = 'people in 18-39',
          timestamp1 = '2020-01-01T00:00:00Z',
          timestamp2 = '2020-02-01T00:00:00Z',
          source_id = 'test/source',
          property1 = {
            source_id,
            name: name1,
            breakdown: [name1, name2],
            timeseries: true,
            timeseries_latest_timestamp: timestamp1,
          };

        console.error = jest.fn();

        const state = {
          data: {
            sources: [
              {
                source_id,
                metadata: {
                  properties: [
                    property1,
                    {
                      name: name2,
                      timeseries: true,
                      timeseries_latest_timestamp: timestamp2,
                    },
                  ],
                },
              },
            ],
            layers: [source_id],
          },
          orbs: {
            isolationPlus: {
              property: {
                source_id,
                name: name1,
                breakdown: [name1, name2],
                timeseries: true,
                timeseries_latest_timestamp: timestamp1,
              },
              clickedFeatures: [
                {
                  object: {
                    properties: {
                      [name1]: [{ timestamp: timestamp1, value: 20 }],
                      [name2]: [{ timestamp: timestamp2, value: 4 }],
                    },
                  },
                },
                {
                  object: {
                    properties: {
                      [name1]: [{ timestamp: timestamp1, value: 3 }],
                      [name2]: [{ timestamp: timestamp2, value: 1 }],
                    },
                  },
                },
              ],
            },
          },
        };
        const result = breakdownAggregationSelector(state);
        expect(console.error).toHaveBeenCalled();
        expect(result).toEqual([{ name: name1, value: 23 }]);
      });
    });

    describe('timeSeriesAggregationSelector', () => {
      it('returns undefined if property is undefined', () => {
        const state = {};

        const result = timeSeriesAggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if clickedFeatures is undefined', () => {
        const state = { clickedFeatures: undefined };

        const result = timeSeriesAggregationSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns most recent value if only one feature', () => {
        const state = {
          isolationPlus: {
            property: {
              name: 'Alternative Claimant Count: Total',
              aggregation: 'mean',
              precision: 1,
            },
            clickedFeatures: [
              {
                object: {
                  properties: {
                    'Alternative Claimant Count: Total': 12,
                  },
                },
              },
            ],
          },
        };

        const result = timeSeriesAggregationSelector(state);
        expect(result).toEqual(12);
      });

      it('returns all timeseries values if multiple features', () => {
        const state = {
          isolationPlus: {
            property: {
              name: 'Alternative Claimant Count: Total',
              aggregation: 'sum',
              precision: 1,
            },
            clickedFeatures: [
              {
                object: {
                  properties: {
                    'Alternative Claimant Count: Total': [
                      {
                        timestamp: '2019-03-02T00:00:00.000Z',
                        value: 5,
                      },
                    ],
                  },
                },
              },
              {
                object: {
                  properties: {
                    'Alternative Claimant Count: Total': [
                      {
                        timestamp: '2019-03-01T00:00:00.000Z',
                        value: 3,
                      },
                    ],
                  },
                },
              },
            ],
          },
        };

        const expected = [
          {
            timestamp: '2019-03-02T00:00:00.000Z',
            value: 5,
          },
          {
            timestamp: '2019-03-01T00:00:00.000Z',
            value: 3,
          },
        ];

        const result = timeSeriesAggregationSelector(state);
        expect(result).toEqual(expected);
      });
    });
  });
});
