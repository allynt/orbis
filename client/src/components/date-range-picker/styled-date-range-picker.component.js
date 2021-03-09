import { styled } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';

export const StyledDateRangePicker = styled(DateRangePicker)(({ theme }) => ({
  fontFamily: `${theme.typography.fontFamily} !important`,
  color: theme.palette.text.primary,
  '& .rdrDefinedRangesWrapper': {
    backgroundColor: theme.palette.background.default,
    '& .rdrStaticRanges': {
      '& .rdrStaticRange': {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        borderColor: theme.palette.divider,
        transition: theme.transitions.create(['color'], {
          duration: theme.transitions.duration.short,
        }),
        '& .rdrStaticRangeLabel': {
          transition: theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.short,
          }),
          ...theme.typography.body1,
        },
        '&:hover': {
          '& .rdrStaticRangeLabel': {
            backgroundColor: theme.palette.secondary.light,
          },
        },
        '&.rdrStaticRangeSelected': {
          color: `${theme.palette.primary.main} !important`,
        },
      },
    },
  },
}));
