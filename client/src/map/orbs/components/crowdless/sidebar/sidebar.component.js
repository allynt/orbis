import * as React from 'react';

import {
  Button,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  List,
  ListSubheader,
  MagnifierIcon,
  makeStyles,
  Pagination,
  Radio,
  Typography,
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
}));

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   isLoading?: boolean
 *   onFindClick: () => void
 *   pages?: number
 *   currentPage?: number
 *   onPageClick: (page: number) => void
 *   onResultClick?: (result: CrowdlessFeature) => void
 *   selectedResult: CrowdlessFeature
 *   onRadioChange: () => void
 *   visible?: boolean
 * }} props
 */
export const CrowdlessSidebarComponent = ({
  results,
  isLoading,
  onFindClick,
  pages,
  currentPage,
  onPageClick,
  onResultClick,
  selectedResult,
  onRadioChange,
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
        <Grid item xs={1}>
          <InfoButtonTooltip tooltipContent={<Description />} />
        </Grid>
      </Grid>
      <Fade in={visible} unmountOnExit>
        <Grid container spacing={2} alignItems="center">
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
          {(isLoading && !results) || results?.length ? (
            <>
              <Grid item xs={12}>
                <List
                  subheader={
                    <ListSubheader disableSticky>
                      Places close to you
                    </ListSubheader>
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
              </Grid>
              {pages > 1 ? (
                <Grid item xs={12} container justify="center">
                  <Pagination
                    hideNextButton
                    hidePrevButton
                    shape="rounded"
                    color="primary"
                    page={currentPage}
                    count={pages}
                    onChange={(_, page) => onPageClick(page)}
                  />
                </Grid>
              ) : null}
            </>
          ) : null}
        </Grid>
      </Fade>
    </div>
  );
};
