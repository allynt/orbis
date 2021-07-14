import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import SearchForm from './search-form/search-form.component';

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
      <Button color="secondary" onClick={onDrawAoiClick}>
        Draw your AOI
      </Button>

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
