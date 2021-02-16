import * as React from 'react';

import {
  Button,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  Typography,
  MagnifierIcon,
  CircularProgress,
  List,
  ListSubheader,
  Fade,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';
import { Description } from './description.component';
import ResultsListItem from './results-list-item/results-list-item.component';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  infoButton: {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
  },
}));

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   isLoading?: boolean
 *   onFindClick: () => void
 *   onRadioChange: () => void
 *   onResultClick?: (result: CrowdlessFeature) => void
 *   selectedResult: CrowdlessFeature
 *   visible?: boolean
 * }} props
 */
export const CrowdlessSidebarComponent = ({
  results,
  isLoading,
  onFindClick,
  onRadioChange,
  onResultClick,
  selectedResult,
  visible,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.wrapper}>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <FormControlLabel
            label="Supermarket Crowdedness"
            control={<Radio onClick={onRadioChange} checked={visible} />}
          />
        </Grid>
        <Grid item xs={1} container justify="center" alignItems="center">
          <InfoButtonTooltip
            iconButtonClassName={styles.infoButton}
            tooltipContent={<Description />}
          />
        </Grid>
      </Grid>
      <Fade in={visible} unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12} component={Typography}>
            Please zoom in to the desired area or add area in the search box{' '}
            <MagnifierIcon color="primary" fontSize="inherit" /> at the top
            right of the map in order to get most accurate results. Then click
            the button “Find Supermarkets” below.
          </Grid>
          <Grid item xs={12} container justify="center">
            <Button size="small" onClick={() => !isLoading && onFindClick()}>
              {isLoading ? (
                <CircularProgress
                  data-testid="button-progress"
                  color="inherit"
                  size={20}
                />
              ) : (
                'Find Supermarkets'
              )}
            </Button>
          </Grid>
          {((isLoading && !results) || results?.length) && (
            <List
              subheader={
                <ListSubheader disableSticky>Places close to you</ListSubheader>
              }
            >
              {isLoading &&
                !results &&
                Array(10)
                  .fill(undefined)
                  .map((_, i) => <ResultsListItem key={i} isLoading />)}
              {results?.length
                ? results.map((result, i) => (
                    <ResultsListItem
                      key={result.properties.placeId}
                      result={result}
                      selected={
                        selectedResult === undefined ||
                        result.properties.placeId ===
                          selectedResult?.properties?.placeId
                      }
                      onClick={onResultClick}
                      divider={i + 1 !== results.length}
                    />
                  ))
                : null}
            </List>
          )}
        </Grid>
      </Fade>
    </div>
  );
};
