import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../orbReducer';
import { RiceRasterSelector } from './demo/rice-raster-sidebar/rice-raster-selector.component';

/** @type {import('typings/orbis').SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const namespaceId = `${selectedLayer.authority}/${selectedLayer.namespace}/rice/*`;
  const other = useSelector(state => otherSelector(namespaceId)(state.orbs));

  return (
    <RiceRasterSelector
      value={other?.column}
      onChange={column =>
        dispatch(
          setOther({
            source_id: namespaceId,
            other: { ...other, column },
          }),
        )
      }
    />
  );
};
