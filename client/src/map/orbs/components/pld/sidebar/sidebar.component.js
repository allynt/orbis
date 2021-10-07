import * as React from 'react';

import {
  Button,
  CircularProgress,
  Fade,
  FormControlLabel,
  Grid,
  List,
  ListSubheader,
  makeStyles,
  Pagination,
  Radio,
} from '@astrosat/astrosat-ui';

import ResultsListItem from './results-list-item/results-list-item.component';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
}));

export const PldSidebarComponent = ({
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
            label="Display Data"
            control={<Radio onClick={onRadioChange} checked={visible} />}
          />
        </Grid>
      </Grid>
      <Fade in={visible} unmountOnExit>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} container justifyContent="center">
            <Button size="small" onClick={() => !isLoading && onFindClick()}>
              {isLoading ? (
                <CircularProgress
                  data-testid="button-progress"
                  color="inherit"
                  size={20}
                />
              ) : (
                'Request Data'
              )}
            </Button>
          </Grid>
          {(isLoading && !results) || results?.length ? (
            <>
              <Grid item xs={12}>
                <List
                  subheader={
                    <ListSubheader disableSticky>List of Builds</ListSubheader>
                  }
                >
                  {isLoading &&
                    !results &&
                    Array(10)
                      .fill(undefined)
                      // eslint-disable-next-line react/no-array-index-key
                      .map((_, i) => <ResultsListItem key={i} isLoading />)}
                  {results?.length
                    ? results.map((result, i) => (
                        <ResultsListItem
                          key={result.id}
                          result={result}
                          selected={
                            selectedResult === undefined ||
                            result.id === selectedResult?.id
                          }
                          onClick={onResultClick}
                          divider={i + 1 !== results.length}
                        />
                      ))
                    : null}
                </List>
              </Grid>
              {pages > 1 ? (
                <Grid item xs={12} container justifyContent="center">
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
