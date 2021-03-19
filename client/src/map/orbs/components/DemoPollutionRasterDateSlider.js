import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { PollutionRasterDateSlider } from './demo/pollution-raster-sidebar/pollution-raster-date-slider.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/air_pollution/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));

  return (
    <PollutionRasterDateSlider
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
