import { alpha, styled } from '@astrosat/astrosat-ui';

import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const important = string => `${string} !important`;

export const StyledDateRangePicker = styled(DateRangePicker)(
  ({ theme: { palette, typography, spacing, shape } }) => ({
    '& .rdrCalendarWrapper': {
      color: palette.text.primary,
      backgroundColor: palette.background.default,
    },
    '& .rdrMonthAndYearWrapper': {
      paddingTop: spacing(2),
    },
    '& .rdrMonthAndYearPickers': {
      '& select': {
        padding: spacing(1, 2, 1, 1),
        borderRadius: shape.borderRadius,
        color: palette.text.primary,
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23${palette.text.primary.replace(
          '#',
          '',
        )}' width='16px' height='16px'><path d='M0 0h24v24H0z' fill='none'/><path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'/></svg>") no-repeat`,
        backgroundPosition: 'right center',
        '&:hover': {
          backgroundColor: palette.action.hover,
        },
        '& option': {
          color: palette.common.black,
        },
      },
    },
    '& .rdrMonthPicker, & .rdrYearPicker': {
      margin: spacing(0, 1),
    },
    '& .rdrNextPrevButton': {
      margin: spacing(0, 2),
      borderRadius: shape.borderRadius,
      background: palette.text.primary,
      '&:hover': {
        background: alpha(palette.text.primary, 0.7),
      },
    },
    '& .rdrPprevButton': {
      '& i': {
        borderColor: `transparent ${palette.background.default} transparent transparent`,
      },
    },
    '& .rdrNextButton': {
      '& i': {
        borderColor: `transparent transparent transparent ${palette.background.default}`,
      },
    },
    '& .rdrWeekDays': {
      padding: spacing(0, 2),
    },
    '& .rdrMonth': {
      padding: spacing(0, 2, 4, 2),
    },
    '& .rdrWeekDay': {
      color: palette.text.primary,
    },
    '& .rdrDay': {
      color: palette.text.primary,
    },
    '& .rdrDayNumber': {
      '& span': {
        color: palette.text.primary,
      },
      fontWeight: typography.fontWeightRegular,
    },
    '& .rdrDayToday .rdrDayNumber span': {
      '&:after': {
        background: palette.primary.main,
      },
    },
    '& .rdrDayToday:not(.rdrDayPassive)': {
      '& .rdrInRange, & .rdrStartEdge, & .rdrEndEdge, & .rdrSelected': {
        '& ~ .rdrDayNumber span:after': {
          background: palette.secondary.main,
        },
      },
    },
    '& .rdrDay:not(.rdrDayPassive)': {
      '& .rdrInRange, & .rdrStartEdge, & .rdrEndEdge, & .rdrSelected': {
        '& ~ .rdrDayNumber': {
          '& span': {
            color: palette.secondary.main,
          },
        },
      },
    },
    '& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge': {
      background: palette.primary.main,
    },
    '& .rdrDayStartPreview, & .rdrDayInPreview, & .rdrDayEndPreview': {
      background: palette.action.hover,
      borderColor: palette.primary.main,
    },
    '& .rdrDefinedRangesWrapper': {
      ...typography.body1,
      borderRightColor: palette.divider,
      background: palette.background.default,

      '& .rdrStaticRangeSelected': {
        '& .rdrStaticRangeLabel': {
          color: important(palette.primary.main),
        },
      },
    },
    '& .rdrStaticRange': {
      borderBottomColor: palette.divider,
      background: palette.background.default,
      '&:hover, &:focus': {
        '& .rdrStaticRangeLabel': {
          background: palette.action.hover,
        },
      },
    },
    '& .rdrStaticRangeLabel': {
      color: palette.text.primary,
      lineHeight: '16px',
      padding: spacing(1, 2),
    },
    '& .rdrDayPassive': {
      opacity: 0,
    },
    '& .rdrDayDisabled': {
      backgroundColor: palette.action.disabled,
      '& .rdrDayNumber span': {
        color: palette.text.disabled,
      },
    },
    '& .rdrMonthName': {
      color: palette.text.primary,
      padding: spacing(2, 1),
    },
  }),
);
