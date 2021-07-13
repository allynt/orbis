import React from 'react';

import { Button, Typography } from '@astrosat/astrosat-ui';

import SatelliteSearchForm from './satellite-search-form/satellite-search-form.component';
import SavedSearchList from './saved-search-list/saved-search-list.component';

/**
 * @param {{
 *  satellites: import('typings/satellites').Satellite[]
 *  savedSearches: import('typings/satellites').SavedSearch[]
 *  currentSearch: Partial<import('typings/satellites').SavedSearch>
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  onDrawAoiClick: React.MouseEventHandler<HTMLButtonElement>
 *  onSearch: (search: Pick<import('typings/satellites').SavedSearch, "satellites" | "end_date" | "start_date" | "tiers">) => void
 *  onSearchReload: (search: import('typings/satellites').SavedSearch) => void
 *  onSearchDelete: (search: import('typings/satellites').SavedSearch) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SatelliteSearch = ({
  satellites,
  savedSearches,
  currentSearch,
  aoi,
  aoiTooLarge = false,
  onDrawAoiClick,
  onSearch,
  onSearchReload,
  onSearchDelete,
  onInfoClick,
}) => {
  return (
    <>
      {savedSearches && savedSearches.length > 0 ? (
        <SavedSearchList
          savedSearches={savedSearches}
          onReloadClick={onSearchReload}
          onDeleteClick={onSearchDelete}
        />
      ) : (
        <Typography>There are no saved AOI yet</Typography>
      )}
      <Button color="secondary" onClick={onDrawAoiClick}>
        Draw your AOI
      </Button>

      <SatelliteSearchForm
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

export default SatelliteSearch;
