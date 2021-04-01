import React from 'react';
import { Button } from '@astrosat/astrosat-ui';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { layersVisibilitySelector, setVisibility } from '../layers.slice';

/** @type {import("typings/orbis").SidebarComponent} */
export default ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const visible = useSelector(state =>
    layersVisibilitySelector(selectedLayer.source_id)(state?.orbs),
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
