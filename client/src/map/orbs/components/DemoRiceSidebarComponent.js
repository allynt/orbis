import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { RiceRasterSidebarComponent } from './demo/rice-raster-sidebar/rice-raster-sidebar.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const other = useSelector(state =>
    otherSelector(selectedLayer.source_id)(state.orbs),
  );
  return (
    <RiceRasterSidebarComponent
      dateValue={other?.date}
      onDateChange={(_, value) =>
        dispatch(
          setOther({
            source_id: selectedLayer.source_id,
            other: { ...other, date: value },
          }),
        )
      }
    />
  );
};
