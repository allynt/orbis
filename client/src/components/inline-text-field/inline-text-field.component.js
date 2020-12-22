import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  makeStyles,
} from '@astrosat/astrosat-ui';
import * as React from 'react';

const useInlineStyles = makeStyles({
  formControl: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    position: 'relative',
    transform: 'translate(0) scale(1)',
    textAlign: 'right',
  },
});

/**
 * @param {{
 *   error?: boolean
 *   helperText?: string
 *   id?: string
 *   inputRef?: React.Ref<any>
 *   label?: string
 *   name?: string
 *   placeholder?: string
 * }} props
 */
export const InlineTextField = ({
  error,
  helperText,
  id,
  inputRef,
  label,
  name,
  placeholder,
}) => {
  const inlineStyles = useInlineStyles();
  return (
    <FormControl
      className={inlineStyles.formControl}
      error={error}
      component={Grid}
      container
      spacing={2}
    >
      <Grid item xs={2}>
        <InputLabel className={inlineStyles.label} htmlFor={id} shrink={false}>
          {label}
        </InputLabel>
      </Grid>
      <Grid item xs={10}>
        <Input
          id={id}
          name={name}
          placeholder={placeholder}
          inputRef={inputRef}
          error={error}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </Grid>
    </FormControl>
  );
};
