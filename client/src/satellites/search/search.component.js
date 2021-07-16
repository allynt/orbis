import React from 'react';

import { Button, Typography, styled } from '@astrosat/astrosat-ui';

import SearchForm from './search-form/search-form.component';

const CenterButton = styled(Button)({ margin: '0 auto' });

/**
 * @param {{
 *  satellites: import('typings/satellites').Satellite[]
 *  currentSearch: Partial<import('typings/satellites').SavedSearch>
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  onDrawAoiClick: React.MouseEventHandler<HTMLButtonElement>
 *  onSearch: (search: Pick<import('typings/satellites').SavedSearch, "satellites" | "end_date" | "start_date">) => void
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
}) => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
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
};

export default Search;
