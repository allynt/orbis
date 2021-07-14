import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import SatelliteSearchForm from './satellite-search-form/satellite-search-form.component';

/**
 * @param {{
 *  satellites: import('typings/satellites').Satellite[]
 *  currentSearch: Partial<import('typings/satellites').SavedSearch>
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  onDrawAoiClick: React.MouseEventHandler<HTMLButtonElement>
 *  onSearch: (search: Pick<import('typings/satellites').SavedSearch, "satellites" | "end_date" | "start_date" | "tiers">) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SatelliteSearch = ({
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
