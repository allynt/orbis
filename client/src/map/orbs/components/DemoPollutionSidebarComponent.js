import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { PollutionRasterSidebar } from './demo/pollution-raster-sidebar/pollution-raster-sidebar.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/air_pollution/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));

  return (
    <PollutionRasterSidebar
      dateValue={other?.date}
      onDateChange={(_, date) =>
        dispatch(
          setOther({
            source_id: namespaceId,
            other: { ...other, date },
          }),
        )
      }
      gas={other?.gas}
      onGasClick={gas =>
        dispatch(
          setOther({
            source_id: namespaceId,
            other: { ...other, gas },
          }),
        )
      }
    />
  );
};
