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
  selectedSources = [],
  selectedCrossFilterProperties = [],
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
        return source?.properties.map(property => {
          const isSelected = !!selectedCrossFilterProperties.find(
            p => p.label === property.label,
          );

          // impose limit on number of selected properties.
          // But we dont disable selected ones to allow the user to deselect existing ones
          const isItemEnabled =
            selectedCrossFilterProperties.length < MAX_SELECTED_PROPERTIES ||
            isSelected;

          const sourceOrProperty = {
            id: property.name,
            label: property.label,
            description: property.description,
          };

          const onChange = () => {
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

  /** @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e */
  const handleSelectAllClick = e => {
    e.stopPropagation();
    if (allSelected)
      onSourcesChange({ source_ids: allSourceIds, selected: false });
    else onSourcesChange({ source_ids: notYetSelected, selected: true });
  };

  return (
    <React.Fragment key={source.category}>
      <ButtonBase className={styles.header} onClick={() => setOpen(c => !c)}>
        <TriangleIcon className={clsx(styles.icon, { [styles.open]: open })} />
        {source.category}
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
        ) : null}
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
  selectedSources = [],
  selectedCrossFilterProperties = [],
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

  const isConfirmButtonDisabled =
    !hasMadeChanges ||
    (isCrossFilteringMode &&
      (selectedCrossFilterProperties.length < MIN_SELECTED_PROPERTIES ||
        selectedCrossFilterProperties.length > MAX_SELECTED_PROPERTIES));

  return (
    <Section orientation="right">
      <Header>Add Data Layers</Header>
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
