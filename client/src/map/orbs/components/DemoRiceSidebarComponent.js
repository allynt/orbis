import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  otherSelector,
  setOther,
  layersVisibilitySelector,
  setVisibility,
} from '../orbReducer';
import { RiceRasterSidebarComponent } from './demo/rice-raster-sidebar/rice-raster-sidebar.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const visible = useSelector(state =>
    layersVisibilitySelector(selectedLayer.source_id)(state.orbs),
  );
  const other = useSelector(state =>
    otherSelector(selectedLayer.source_id)(state.orbs),
  );
  return (
    <RiceRasterSidebarComponent
      dateValue={other?.date}
      onDateChange={(_, date) =>
        dispatch(
          setOther({
            source_id: selectedLayer.source_id,
            other: { ...other, date },
          }),
        )
      }
      column={other?.column}
      onColumnClick={column =>
        dispatch(
          setOther({
            source_id: selectedLayer.source_id,
            other: { ...other, column },
          }),
        )
      }
      visible={visible}
      onVisibilityClick={() =>
        dispatch(
          setVisibility({
            source_id: selectedLayer.source_id,
            visible: !visible,
          }),
        )
      }
    />
  );
};
