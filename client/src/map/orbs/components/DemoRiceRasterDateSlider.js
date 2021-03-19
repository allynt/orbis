import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { RiceRasterDateSlider } from './demo/rice-raster-sidebar/rice-raster-date-slider.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/rice/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));

  return (
    <RiceRasterDateSlider
      dateValue={other?.date}
      onDateChange={(_, date) =>
        dispatch(
          setOther({
            source_id: namespaceId,
            other: { ...other, date },
          }),
        )
      }
    />
  );
};
