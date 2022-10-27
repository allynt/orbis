import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LayerSelect } from './layer-select.component';

const SUBMIT_BUTTON = /confirm/i;
const SELECT_ALL = /^select\sall/i;
const UNSELECT_ALL = /unselect\sall/i;

const OIL_PARENT = /oil parent 1/i;
const OIL_CHILD = /oil child 1/i;
const GAS_PARENT_1 = /gas parent 1/i;

const SOURCES = [
  {
    source_id: 'oil/source/1',
    name: 'Oil',
    metadata: {
      name: 'Oil',
      label: 'Oil Source 1',
      application: {
        orbis: {
          categories: {
            name: 'Oil Parent 1',
            child: { name: 'Oil Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
          crossfiltering: {
            layer: {
              name: 'MVTComboLayer',
              props: {
                config: 'isolationPlusLayerConfig',
              },
            },
            geometry_types_hierarchy: ['OA', 'LSOA', 'MSOA', 'LAD16', 'LAD19'],
            OA: {
              tiles: [
                'https://staticdata.testing.astrosat.net/astrosat/isolation_plus/dwp_benefits/crossfiltering/oa_gb_benefits_breakdown_raw_crossfilter__mvt/{z}/{x}/{y}.pbf',
              ],
            },
            LSOA: {
              tiles: [
                'https://staticdata.testing.astrosat.net/astrosat/isolation_plus/dwp_benefits/crossfiltering/lsoa_gb_benefits_breakdown_raw_crossfilter__mvt/{z}/{x}/{y}.pbf',
              ],
            },
            MSOA: {
              tiles: [
                'https://staticdata.testing.astrosat.net/astrosat/isolation_plus/dwp_benefits/crossfiltering/msoa_gb_benefits_breakdown_raw_crossfilter__mvt/{z}/{x}/{y}.pbf',
              ],
            },
            LAD16: {
              tiles: [
                'https://staticdata.testing.astrosat.net/astrosat/isolation_plus/dwp_benefits/crossfiltering/lad16_gb_benefits_breakdown_raw_crossfilter__mvt/{z}/{x}/{y}.pbf',
              ],
            },
            LAD19: {
              tiles: [
                'https://staticdata.testing.astrosat.net/astrosat/isolation_plus/dwp_benefits/crossfiltering/lad19_gb_benefits_breakdown_raw_crossfilter__mvt/{z}/{x}/{y}.pbf',
              ],
            },
          },
        },
      },
      properties: [
        {
          name: 'foobar',
          label: 'First item',
          description: 'This is a first property',
        },
        {
          name: 'barbaz',
          label: 'Second Item',
          description: 'This is a second property',
        },
        {
          name: 'bazgaz',
          label: 'Third Item',
          description: 'This is a third property',
        },
        {
          name: 'abbbob',
          label: 'Fourth Item',
          description: 'This is a fourth property',
        },
        {
          name: 'bobcob',
          label: 'Fifth Item',
          description: 'This is a fifth property',
        },
      ],
    },
  },
  {
    source_id: 'oil/source/2',
    name: 'Oil',
    metadata: {
      name: 'Oil',
      label: 'Oil Source 2',
      application: {
        orbis: {
          categories: {
            name: 'Oil Parent 1',
            child: { name: 'Oil Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
      properties: [
        {
          name: 'foobar',
          label: 'First item',
          description: 'This is a first property',
        },
        {
          name: 'barbaz',
          label: 'Second Item',
          description: 'This is a second property',
        },
        {
          name: 'bazgaz',
          label: 'Third Item',
          description: 'This is a third property',
        },
        {
          name: 'abbbob',
          label: 'Fourth Item',
          description: 'This is a fourth property',
        },
        {
          name: 'bobcob',
          label: 'Fifth Item',
          description: 'This is a fifth property',
        },
      ],
    },
  },
  {
    source_id: 'gas/source/1',
    name: 'Gas',
    metadata: {
      name: 'Gas',
      label: 'Gas Source 1',
      application: {
        orbis: {
          categories: {
            name: 'Gas Parent 1',
            child: { name: 'Gas Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
      properties: [
        {
          name: 'foobar',
          label: 'First item',
          description: 'This is a first property',
        },
        {
          name: 'barbaz',
          label: 'Second Item',
          description: 'This is a second property',
        },
        {
          name: 'bazgaz',
          label: 'Third Item',
          description: 'This is a third property',
        },
        {
          name: 'abbbob',
          label: 'Fourth Item',
          description: 'This is a fourth property',
        },
        {
          name: 'bobcob',
          label: 'Fifth Item',
          description: 'This is a fifth property',
        },
      ],
    },
  },
  {
    source_id: 'gas/source/2',
    name: 'Gas',
    metadata: {
      name: 'Gas',
      label: 'Gas Source 2',
      application: {
        orbis: {
          categories: {
            name: 'Gas Parent 1',
            child: { name: 'Gas Child 1' },
          },
          orbs: [{ name: 'Oil and Gas', description: 'test' }],
        },
      },
      properties: [
        {
          name: 'foobar',
          label: 'First item',
          description: 'This is a first property',
        },
        {
          name: 'barbaz',
          label: 'Second Item',
          description: 'This is a second property',
        },
        {
          name: 'bazgaz',
          label: 'Third Item',
          description: 'This is a third property',
        },
        {
          name: 'abbbob',
          label: 'Fourth Item',
          description: 'This is a fourth property',
        },
        {
          name: 'bobcob',
          label: 'Fifth Item',
          description: 'This is a fifth property',
        },
      ],
    },
  },
];

const renderComponent = ({
  sources = SOURCES,
  hasMadeChanges = false,
  selectedSources = [],
  selectedCrossFilterProperties = [],
  selectedOrbName = 'Oil and Gas',
  isCrossFilteringMode = false,
} = {}) => {
  const onSourceChange = jest.fn();
  const onSourcesChange = jest.fn();
  const onSubmit = jest.fn();
  const onCrossFilterPropertiesChange = jest.fn();
  const utils = render(
    <LayerSelect
      sources={sources}
      selectedSources={selectedSources}
      selectedCrossFilterProperties={selectedCrossFilterProperties}
      isCrossFilteringMode={isCrossFilteringMode}
      onSourceChange={onSourceChange}
      onSourcesChange={onSourcesChange}
      onSubmit={onSubmit}
      selectedOrbName={selectedOrbName}
      hasMadeChanges={hasMadeChanges}
      onCrossFilterPropertiesChange={onCrossFilterPropertiesChange}
    />,
  );
  return {
    ...utils,
    onSourceChange,
    onSourcesChange,
    onCrossFilterPropertiesChange,
  };
};

describe('<LayerSelect />', () => {
  describe('<LayerSelect /> Non-crossfiltering tests', () => {
    it('shows text when no orb is selected', () => {
      const { getByText } = renderComponent({
        orbs: null,
        selectedOrbName: null,
      });
      expect(
        getByText('Select Your Orb in order to find layers'),
      ).toBeInTheDocument();
    });

    it('disables the button when no changes have been made', () => {
      const { getByRole } = renderComponent();
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeDisabled();
    });

    it('shows category headings', () => {
      const { getByRole } = renderComponent();
      expect(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      ).toBeInTheDocument();
      expect(
        getByRole('button', {
          name: GAS_PARENT_1,
        }),
      ).toBeInTheDocument();
    });

    it('expands the category headings when clicked', () => {
      const { getByRole } = renderComponent();
      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      expect(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      ).toBeInTheDocument();
    });

    it('hides categories when heading is clicked again', async () => {
      const { getByRole, queryByRole } = renderComponent();
      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      expect(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      ).toBeInTheDocument();

      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      await waitFor(() =>
        expect(
          queryByRole('button', {
            name: OIL_CHILD,
          }),
        ).not.toBeInTheDocument(),
      );
    });

    it('shows sub-category headings', () => {
      const { getByRole } = renderComponent();

      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );

      expect(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      ).toBeInTheDocument();
    });

    it('expands sub-category headings when clicked', async () => {
      const { getByRole } = renderComponent();

      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      userEvent.click(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      );

      const checkbox = getByRole('button', {
        name: 'Oil Source 1',
      });

      await waitFor(() => expect(checkbox).toBeInTheDocument());
    });

    it('hides sub-categories when heading is clicked again', async () => {
      const { getByRole, queryByRole } = renderComponent();

      const categoryHeading = getByRole('button', {
        name: OIL_PARENT,
      });

      userEvent.click(categoryHeading);

      const subCategoryHeading = getByRole('button', {
        name: OIL_CHILD,
      });

      userEvent.click(subCategoryHeading);

      expect(
        getByRole('button', {
          name: 'Oil Source 1',
        }),
      ).toBeInTheDocument();

      userEvent.click(subCategoryHeading);

      await waitFor(() =>
        expect(
          queryByRole('button', {
            name: 'Oil Source 1',
          }),
        ).not.toBeInTheDocument(),
      );
    });

    it('calls onSourceChange when a source is clicked', async () => {
      const { getByRole, onSourcesChange } = renderComponent();

      userEvent.click(getByRole('button', { name: OIL_PARENT }));

      userEvent.click(getByRole('button', { name: OIL_CHILD }));

      userEvent.click(
        getByRole('button', {
          name: 'Oil Source 1',
        }),
      );

      await waitFor(() => expect(onSourcesChange).toHaveBeenCalled());
    });

    it('enables the submit button when changes have been made', () => {
      const { getByRole } = renderComponent({ hasMadeChanges: true });
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeEnabled();
    });

    it('shows the count of selected layers in a category', () => {
      const { getAllByText } = renderComponent({
        selectedSources: ['oil/source/1'],
      });
      // eslint-disable-next-line jest-dom/prefer-in-document
      expect(getAllByText('(1/2)')).toHaveLength(1);
    });

    describe('Select All', () => {
      it('calls onSourcesChange with all sources within a category when "Select All"  is clicked', () => {
        const { onSourcesChange, getAllByRole } = renderComponent();
        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: true,
        });
      });

      it('calls onSourcesChange with all sources within a sub-category when "Select All" is clicked', () => {
        const { onSourcesChange, getByRole, getAllByRole } = renderComponent();

        userEvent.click(
          getByRole('button', {
            name: OIL_PARENT,
          }),
        );

        userEvent.click(
          getByRole('button', {
            name: OIL_CHILD,
          }),
        );

        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[1]);

        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: true,
        });
      });

      it('calls onSourcesChange with all sources within a category when "Unselect All" is clicked', () => {
        const { onSourcesChange, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1', 'oil/source/2'],
        });
        userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: false,
        });
      });

      it('calls onSourcesChange with all sources within a sub-category when "Unselect All" is clicked', () => {
        const { onSourcesChange, getByRole, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1', 'oil/source/2'],
        });

        userEvent.click(
          getByRole('button', {
            name: OIL_PARENT,
          }),
        );

        userEvent.click(
          getByRole('button', {
            name: OIL_CHILD,
          }),
        );

        userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: false,
        });
      });

      it('calls onSourcesChange with only the sources which have changed', () => {
        const { onSourcesChange, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1'],
        });
        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/2'],
          selected: true,
        });
      });
    });
  });

  describe('<LayerSelect /> Crossfiltering tests', () => {
    it('shows text when no orb is selected', () => {
      const { getByText } = renderComponent({
        orbs: null,
        selectedOrbName: null,
        isCrossFilteringMode: true,
      });
      expect(
        getByText('Select Your Orb in order to find layers'),
      ).toBeInTheDocument();
    });

    it('disables the button when no changes have been made', () => {
      const { getByRole } = renderComponent({ isCrossFilteringMode: true });
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeDisabled();
    });

    it('shows category headings', () => {
      const { getByRole } = renderComponent();
      expect(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      ).toBeInTheDocument();
      expect(
        getByRole('button', {
          name: GAS_PARENT_1,
        }),
      ).toBeInTheDocument();
    });

    it('expands the category headings when clicked', () => {
      const { getByRole } = renderComponent({ isCrossFilteringMode: true });
      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      expect(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      ).toBeInTheDocument();
    });

    it('hides sub-categories when heading is clicked again', async () => {
      const { getByRole, queryByRole } = renderComponent({
        isCrossFilteringMode: true,
      });

      const categoryHeading = getByRole('button', {
        name: OIL_PARENT,
      });

      userEvent.click(categoryHeading);

      const subCategoryHeading = getByRole('button', {
        name: OIL_CHILD,
      });

      userEvent.click(subCategoryHeading);

      expect(
        getByRole('button', {
          name: 'Oil Source 1',
        }),
      ).toBeInTheDocument();

      userEvent.click(subCategoryHeading);

      await waitFor(() =>
        expect(
          queryByRole('button', {
            name: 'Oil Source 1',
          }),
        ).not.toBeInTheDocument(),
      );
    });

    it('shows sub-category headings', () => {
      const { getByRole } = renderComponent({ isCrossFilteringMode: true });

      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );

      expect(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      ).toBeInTheDocument();
    });

    it('expands sub-category headings when clicked', async () => {
      const { getByRole } = renderComponent({ isCrossFilteringMode: true });

      userEvent.click(
        getByRole('button', {
          name: OIL_PARENT,
        }),
      );
      userEvent.click(
        getByRole('button', {
          name: OIL_CHILD,
        }),
      );

      const checkbox = getByRole('button', {
        name: 'Oil Source 1',
      });

      await waitFor(() => expect(checkbox).toBeInTheDocument());
    });

    it('hides sub-categories when heading is clicked again', async () => {
      const { getByRole, queryByRole } = renderComponent({
        isCrossFilteringMode: true,
        selectedCrossFilterProperties: [],
      });

      const categoryHeading = getByRole('button', {
        name: OIL_PARENT,
      });

      userEvent.click(categoryHeading);

      const subCategoryHeading = getByRole('button', {
        name: OIL_CHILD,
      });

      userEvent.click(subCategoryHeading);

      expect(
        getByRole('button', {
          name: 'Oil Source 1',
        }),
      ).toBeInTheDocument();

      userEvent.click(subCategoryHeading);

      await waitFor(() =>
        expect(
          queryByRole('button', {
            name: 'Oil Source 1',
          }),
        ).not.toBeInTheDocument(),
      );
    });

    it('calls onCrossFilterPropertiesChange when a property is clicked', async () => {
      const { getByRole, onCrossFilterPropertiesChange } = renderComponent({
        isCrossFilteringMode: true,
      });

      userEvent.click(getByRole('button', { name: OIL_PARENT }));

      userEvent.click(getByRole('button', { name: OIL_CHILD }));

      userEvent.click(
        getByRole('button', {
          name: 'Oil Source 1',
        }),
      );

      userEvent.click(
        getByRole('button', {
          name: 'First item',
        }),
      );

      await waitFor(() =>
        expect(onCrossFilterPropertiesChange).toHaveBeenCalled(),
      );
    });

    it('enables the submit button when sufficient changes have been made', () => {
      const { getByRole } = renderComponent({
        hasMadeChanges: true,
        isCrossFilteringMode: true,
        selectedCrossFilterProperties: [
          'First item',
          'Second item',
          'Third item',
        ],
      });
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeEnabled();
    });

    it('enables the submit button when changes made and no properties are selected', () => {
      const { getByRole } = renderComponent({
        hasMadeChanges: true,
        isCrossFilteringMode: true,
        selectedCrossFilterProperties: [],
      });

      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeEnabled();
    });

    it('disables the submit button when too few changes have been made', () => {
      const { getByRole } = renderComponent({
        hasMadeChanges: true,
        isCrossFilteringMode: true,
        selectedCrossFilterProperties: ['First item'],
      });
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeDisabled();
    });

    it('disables the submit button when too many changes have been made', () => {
      const { getByRole } = renderComponent({
        hasMadeChanges: true,
        isCrossFilteringMode: true,
        selectedCrossFilterProperties: [
          'First item',
          'Second item',
          'Third item',
          'Fourth item',
          'Fifth item',
        ],
      });
      expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeDisabled();
    });

    describe('Select All', () => {
      it('calls onSourcesChange with all sources within a category when "Select All"  is clicked', () => {
        const { onSourcesChange, getAllByRole } = renderComponent();
        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: true,
        });
      });

      it('calls onSourcesChange with all sources within a sub-category when "Select All" is clicked', () => {
        const { onSourcesChange, getByRole, getAllByRole } = renderComponent();

        userEvent.click(
          getByRole('button', {
            name: OIL_PARENT,
          }),
        );

        userEvent.click(
          getByRole('button', {
            name: OIL_CHILD,
          }),
        );

        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[1]);

        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: true,
        });
      });

      it('calls onSourcesChange with all sources within a category when "Unselect All" is clicked', () => {
        const { onSourcesChange, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1', 'oil/source/2'],
        });
        userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: false,
        });
      });

      it('calls onSourcesChange with all sources within a sub-category when "Unselect All" is clicked', () => {
        const { onSourcesChange, getByRole, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1', 'oil/source/2'],
        });

        userEvent.click(
          getByRole('button', {
            name: OIL_PARENT,
          }),
        );

        userEvent.click(
          getByRole('button', {
            name: OIL_CHILD,
          }),
        );

        userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/1', 'oil/source/2'],
          selected: false,
        });
      });

      it('calls onSourcesChange with only the sources which have changed', () => {
        const { onSourcesChange, getAllByRole } = renderComponent({
          selectedSources: ['oil/source/1'],
        });
        userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
        expect(onSourcesChange).toHaveBeenCalledWith({
          source_ids: ['oil/source/2'],
          selected: true,
        });
      });
    });
  });
});
