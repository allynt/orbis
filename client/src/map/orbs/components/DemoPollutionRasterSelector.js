import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { PollutionRasterSelector } from './demo/pollution-raster-sidebar/pollution-raster-selector.component';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/air_pollution/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));
  return (
    <PollutionRasterSelector
      value={other?.gas}
      onChange={gas =>
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
