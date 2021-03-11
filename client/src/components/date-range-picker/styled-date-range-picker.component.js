import { styled } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

const important = string => `${string} !important`;

export const StyledDateRangePicker = styled(DateRangePicker)(
  ({ theme: { palette, typography, transitions } }) => ({
    fontFamily: important(typography.fontFamily),
    color: palette.text.primary,
    '& .rdrDefinedRangesWrapper': {
      backgroundColor: palette.background.default,
      borderColor: palette.divider,
      '& .rdrStaticRange': {
        color: palette.text.primary,
        backgroundColor: palette.background.default,
        borderColor: palette.divider,
        transition: transitions.create(['color'], {
          duration: transitions.duration.short,
        }),
        '& .rdrStaticRangeLabel': {
          transition: transitions.create(['background-color'], {
            duration: transitions.duration.short,
          }),
          ...typography.body1,
        },
        '&:hover': {
          '& .rdrStaticRangeLabel': {
            backgroundColor: palette.action.hover,
          },
        },
        '&.rdrStaticRangeSelected': {
          color: `${palette.primary.main} !important`,
        },
      },
    },
    '& .rdrCalendarWrapper': {
      backgroundColor: palette.background.default,
    },
    '& .rdrDay': {
      '& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge': {
        backgroundColor: palette.primary.main,
        '& ~ .rdrDayNumber': {
          '& span': {
            color: palette.secondary.main,
            '&::after': {
              backgroundColor: palette.secondary.main,
            },
          },
        },
      },
      '& .rdrDayNumber': {
        '& span': {
          color: palette.text.primary,
          '&::after': {
            backgroundColor: palette.primary.main,
          },
        },
      },
      '&.rdrDayPassive': {
        opacity: 0,
      },
    },
  }),
);
