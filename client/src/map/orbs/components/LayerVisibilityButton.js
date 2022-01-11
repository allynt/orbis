import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import { visibilitySelector, setVisibility } from '../layers.slice';

/** @type {import("typings/orbis").SidebarComponent} */
const LayerVisibilityButton = ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const visible = useSelector(state =>
    visibilitySelector(selectedLayer.source_id)(state?.orbs),
  );

  const handleClick = () => {
    dispatch(
      setVisibility({ key: selectedLayer.source_id, visible: !visible }),
    );
  };

  return (
    <Button
      size="small"
      onClick={handleClick}
      startIcon={
        visible ? (
          <VisibilityOff titleAccess="hide" />
        ) : (
          <Visibility titleAccess="show" />
        )
      }
    >
      {visible ? 'Hide' : 'Show'}
    </Button>
  );
};

export default LayerVisibilityButton;
