import React from 'react';

import { Button, Typography, styled } from '@astrosat/astrosat-ui';

import SearchForm from './search-form/search-form.component';

const CenterButton = styled(Button)({ margin: '0 auto' });

/**
 * @param {{
 *  satellites: import('typings').Satellite[]
 *  currentSearch: Partial<import('typings').SavedSearch>
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  onDrawAoiClick: React.MouseEventHandler<HTMLButtonElement>
 *  onSearch: (search: Pick<import('typings').SavedSearch, "satellites" | "end_date" | "start_date">) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const Search = ({
  satellites,
  currentSearch,
  aoi,
  aoiTooLarge = false,
  onDrawAoiClick,
  onSearch,
  onInfoClick,
}) => (
  <>
    <Typography variant="h3" component="h1" gutterBottom>
      Search
    </Typography>
    <Typography paragraph>
      Please draw the Area Of Interest on the map to search for available
      images. Set the time frame and Satellite source for your search.
    </Typography>
    <CenterButton color="secondary" onClick={onDrawAoiClick}>
      Draw your AOI
    </CenterButton>

    <SearchForm
      satellites={satellites}
      aoi={aoi}
      aoiTooLarge={aoiTooLarge}
      currentSearch={currentSearch}
      onSubmit={onSearch}
      onInfoClick={onInfoClick}
    />
  </>
);

export default Search;
