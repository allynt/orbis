import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { otherSelector, setOther } from '../layers.slice';
import { RadioGroup } from './radio-group/radio-group.component';

/**
 * @type {import("typings/orbis").SidebarComponent<{
 *  defaultValue?: any
 *  options: {value: any, label?: string, image?: string}[]
 *  stateKey? :string
 *  valueKey? :string
 * }>}
 */
export default ({
  selectedLayer,
  options,
  defaultValue,
  stateKey = selectedLayer.source_id,
  valueKey = 'radioGroupValue',
}) => {
  const dispatch = useDispatch();
  const other = useSelector(state => otherSelector(stateKey)(state.orbs));

  return (
    <RadioGroup
      options={options}
      defaultValue={defaultValue}
      value={other?.[valueKey]}
      onChange={value =>
        dispatch(
          setOther({
            key: stateKey,
            other: { ...other, [valueKey]: value },
          }),
        )
      }
    />
  );
};
