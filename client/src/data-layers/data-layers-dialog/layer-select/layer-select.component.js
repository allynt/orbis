import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  Link,
  makeStyles,
  Typography,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { difference, isEmpty } from 'lodash';

import {
  collectSourceIds,
  collectSourceProperties,
  createOrbsWithCategorisedSources,
} from 'data-layers/categorisation.utils';

import {
  MIN_SELECTED_PROPERTIES,
  MAX_SELECTED_PROPERTIES,
} from '../../data-layers.constants';
import { Header } from '../components/header.component';
import { List } from '../components/list.component';
import { Section } from '../components/section.component';
import { layerSearchFilter } from './layer-search/layer-search-filter';
import LayerSearch from './layer-search/layer-search.component';
import LayerSelectItem from './layer-select-item/layer-select-item.component';

/**
 * @param {{
 *  sources: import('typings').CategorisedSources
 *  level: number
 *  onSourcesChange?: (params: {
 *    source_ids: import('typings').Source['source_id'][]
 *    selected: boolean
 *  }) => void
 *  onCrossFilterPropertiesChange?: (params: {
 *    properties: object[]
 *    selected: boolean
 *  }) => void
 *  selectedSources: import('typings').Source['source_id'][],
 *  selectedCrossFilterProperties: object[],
 *  isCrossFilteringMode: boolean
 * }} params
 */
const renderCategories = ({
  sources,
  level,
  onSourcesChange,
  onCrossFilterPropertiesChange,
  selectedSources,
  selectedCrossFilterProperties,
  isCrossFilteringMode,
}) =>
  sources?.map(source => {
    if (source.category) {
      return (
        <Accordion
          key={source.category}
          source={source}
          level={level}
          onSourcesChange={onSourcesChange}
          selectedSources={selectedSources}
          isCrossFilteringMode={isCrossFilteringMode}
          selectedCrossFilterProperties={selectedCrossFilterProperties}
          onCrossFilterPropertiesChange={onCrossFilterPropertiesChange}
        />
      );
    } else {
      if (!isCrossFilteringMode) {
        const isSelected = selectedSources?.includes(source.source_id);

        const sourceOrProperty = {
          id: source.source_id,
          label: source.metadata.label,
          description: source?.metadata?.description,
        };

        return (
          <LayerSelectItem
            key={source.source_id}
            isSelected={isSelected}
            sourceOrProperty={sourceOrProperty}
            onChange={() =>
              onSourcesChange({
                source_ids: [source.source_id],
                selected: !isSelected,
              })
            }
          />
        );
      } else {
        return source?.metadata?.properties.map(property => {
          const isSelected = !!selectedCrossFilterProperties.find(
            p => p.name === property.name,
          );

          // impose limit on number of selected properties.
          // But we dont disable selected ones to allow the user to deselect existing ones
          const isItemEnabled =
            selectedCrossFilterProperties.length < MAX_SELECTED_PROPERTIES ||
            isSelected;

          const sourceOrProperty = {
            id: property.name,
            label:
              property?.application?.orbis?.crossfiltering?.label ??
              property.label,
            description:
              property?.application?.orbis?.crossfiltering?.description ??
              property.description,
          };

          const onChange = () => {
            onSourcesChange({
              source_ids: [source.source_id],
              selected: !isSelected,
            });
            onCrossFilterPropertiesChange({
              properties: [property],
              selected: !isSelected,
            });
          };

          return (
            <LayerSelectItem
              key={property.name}
              isSelected={isSelected}
              sourceOrProperty={sourceOrProperty}
              onChange={onChange}
              isItemEnabled={isItemEnabled}
            />
          );
        });
      }
    }
  });

const useAccordionStyles = makeStyles(theme => ({
  header: props => ({
    ...theme.typography.body1,
    width: '100%',
    padding: theme.spacing(1, 2),
    paddingLeft: theme.spacing(props.level + 1),
    marginBottom: props.level === 0 ? theme.spacing(1) : 0,
    display: 'flex',
    alignItems: 'center',
    backgroundColor:
      props.level === 0 ? theme.palette.secondary.main : 'transparent',
    color:
      props.level === 0
        ? theme.palette.getContrastText(theme.palette.secondary.main)
        : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'flex-start',
    fontWeight: 600,
  }),
  selectAll: {
    marginLeft: 'auto',
    padding: 0,
    color: props =>
      props.level === 0
        ? theme.palette.getContrastText(theme.palette.secondary.main)
        : theme.palette.text.primary,
  },
  sourceCount: {
    fontWeight: 'normal',
    marginLeft: theme.spacing(1),
  },
  icon: {
    fontSize: 'inherit',
    marginRight: theme.spacing(1),
    transform: 'rotate(90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.sharp,
    }),
    '&$open': {
      transform: 'rotate(180deg)',
    },
  },
  open: {},
  category: {
    textAlign: 'left',
    margin: 'unset',
  },
}));

const Accordion = ({
  source,
  level,
  onSourcesChange,
  selectedSources,
  isCrossFilteringMode,
  selectedCrossFilterProperties,
  onCrossFilterPropertiesChange,
}) => {
  const styles = useAccordionStyles({ level });
  const [open, setOpen] = useState(false);
  const allSourceIds = useMemo(
    () => collectSourceIds(source.sources),
    [source],
  );
  const notYetSelected = useMemo(
    () => difference(allSourceIds, selectedSources),
    [allSourceIds, selectedSources],
  );
  const selectedCount = allSourceIds.length - notYetSelected.length;
  const allSelected = isEmpty(notYetSelected);

  const propertiesCount = source.sources.reduce(
    (acc, val) => acc + val?.metadata?.properties?.length,
    0,
  );
  // calculate the number of properties selected for an individual dataset.
  const noOfSelectedPropertiesForDataset = source.sources.reduce((acc, val) => {
    if (val?.metadata) {
      acc = selectedCrossFilterProperties.reduce((propAcc, propVal) => {
        if (
          val?.metadata?.properties.includes(
            val?.metadata?.properties.find(item => item.name === propVal.name),
          )
        ) {
          propAcc += 1;
        }
        return propAcc;
      }, 0);
    }
    return acc;
  }, 0);

  /** @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e */
  const handleSelectAllClick = e => {
    e.stopPropagation();
    if (allSelected)
      onSourcesChange({ source_ids: allSourceIds, selected: false });
    else onSourcesChange({ source_ids: notYetSelected, selected: true });
  };

  const handleCrossfilterUnselectAllClick = e => {
    e.stopPropagation();

    onSourcesChange({ source_ids: allSourceIds, selected: false });

    const properties = collectSourceProperties(source.sources);
    onCrossFilterPropertiesChange({
      properties,
      selected: false,
    });
  };

  return (
    <React.Fragment key={source.category}>
      <ButtonBase className={styles.header} onClick={() => setOpen(c => !c)}>
        <TriangleIcon className={clsx(styles.icon, { [styles.open]: open })} />
        <p className={styles.category}>{source.category}</p>
        <>
          {!isCrossFilteringMode ? (
            <>
              <span className={styles.sourceCount}>
                ({selectedCount <= 0 ? '' : `${selectedCount}/`}
                {allSourceIds.length})
              </span>
              <Link
                variant="body2"
                component="span"
                role="button"
                className={styles.selectAll}
                onClick={handleSelectAllClick}
              >
                {allSelected ? 'unselect' : 'select'} all
              </Link>
            </>
          ) : (
            <>
              {isNaN(propertiesCount) ? (
                <span className={styles.sourceCount}>
                  ({selectedCount <= 0 ? '' : `${selectedCount}/`}
                  {allSourceIds.length})
                </span>
              ) : (
                <span className={styles.sourceCount}>
                  (
                  {selectedCrossFilterProperties.length <= 0
                    ? ''
                    : `${noOfSelectedPropertiesForDataset}/`}
                  {isNaN(propertiesCount) ? 0 : propertiesCount})
                </span>
              )}
              <Link
                variant="body2"
                component="span"
                role="button"
                className={styles.selectAll}
                onClick={handleCrossfilterUnselectAllClick}
                disabled={false}
              >
                unselect all
              </Link>
            </>
          )}
        </>
      </ButtonBase>
      <Collapse
        unmountOnExit
        in={open}
        component={Box}
        pl={level + 1.65}
        mb={1}
      >
        {renderCategories({
          sources: source.sources,
          level: level + 1,
          onSourcesChange,
          selectedSources,
          isCrossFilteringMode,
          selectedCrossFilterProperties,
          onCrossFilterPropertiesChange,
        })}
      </Collapse>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  noOrbMessage: {
    placeSelf: 'center',
    padding: theme.spacing(4),
    height: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: theme.spacing(2, 4),
  },
  strapline: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

/**
 * @param {{
 *   sources: import('typings').Source[]
 *   selectedSources?: import('typings').Source['source_id'][],
 *   selectedCrossFilterProperties?: object[],
 *   selectedOrbName?: string,
 *   isCrossFilteringMode: boolean,
 *   hasMadeChanges?: boolean
 *   onSourcesChange?: (params: {
 *     source_ids: import('typings').Source['source_id'][]
 *     selected: boolean}) => void,
 *   onCrossFilterPropertiesChange?: (params: {
 *     properties: object[]
 *     selected: boolean}) => void,
 *   onSubmit: () => void
 * }} props
 */
export const LayerSelect = ({
  sources,
  selectedSources,
  selectedCrossFilterProperties,
  selectedOrbName,
  isCrossFilteringMode,
  hasMadeChanges = false,
  onSourcesChange,
  onCrossFilterPropertiesChange,
  onSubmit,
}) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState(undefined);

  const categorisedSources =
    createOrbsWithCategorisedSources(
      searchTerm ? layerSearchFilter(sources, searchTerm) : sources,
      undefined,
      false,
      isCrossFilteringMode,
    )?.find(orb => orb.name === selectedOrbName)?.sources || [];

  const areCrossFilteringPropertiesValid =
    isCrossFilteringMode &&
    selectedCrossFilterProperties.length >= MIN_SELECTED_PROPERTIES &&
    selectedCrossFilterProperties.length <= MAX_SELECTED_PROPERTIES;

  // enables button if changes have been made since opening
  // or all checkboxes are empty after making changes (unselecting all)
  // or the number of checkboxes fulfils `areCrossFilteringPropertiesValid`
  const isConfirmButtonDisabled =
    !hasMadeChanges ||
    (!!selectedCrossFilterProperties.length &&
      !areCrossFilteringPropertiesValid);

  return (
    <Section orientation="right">
      <Header>
        {isCrossFilteringMode ? (
          <>
            <div>Filter up to 4 Data Layer Properties</div>
          </>
        ) : (
          <div>Add Data Layers</div>
        )}
      </Header>

      {isCrossFilteringMode ? (
        <div className={styles.strapline}>
          {selectedCrossFilterProperties.length} of 4 properties selected
        </div>
      ) : null}

      {selectedOrbName ? (
        <>
          <LayerSearch
            searchTerm={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            noResults={!categorisedSources?.length}
          />
          <List dense>
            {renderCategories({
              sources: categorisedSources,
              level: 0,
              onSourcesChange,
              onCrossFilterPropertiesChange,
              selectedSources,
              selectedCrossFilterProperties,
              isCrossFilteringMode,
            })}
          </List>
        </>
      ) : (
        <Typography className={styles.noOrbMessage}>
          Select Your Orb in order to find layers
        </Typography>
      )}
      <div className={styles.buttonContainer}>
        <Button disabled={isConfirmButtonDisabled} onClick={onSubmit}>
          Confirm
        </Button>
      </div>
    </Section>
  );
};
