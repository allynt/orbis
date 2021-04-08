import React from 'react';
import { v4 } from 'uuid';

/**
 * @template T
 * @param {{
 *   alt?: string
 *   src?: string
 *   icon?: React.ReactNode
 *   onChange?: (value: T) => void
 *   text?: string
 *   value?: T
 * name?: string
 *   selectedValue?: T
 * }} props
 */
export const ImageListItem = ({
  text,
  src,
  alt,
  icon,
  value,
  name,
  selectedValue,
  onChange,
}) => {
  const labelId = `image-list-item-${v4()}`;

  const handleChange = () => onChange && onChange(value);

  return (
    <>
      {!!src ? <img src={src} alt={alt} /> : null}
      {icon}
      <input
        type="radio"
        aria-labelledby={labelId}
        onChange={handleChange}
        checked={selectedValue === value}
        name={name}
      />
      <label id={labelId}>{text}</label>
    </>
  );
};
