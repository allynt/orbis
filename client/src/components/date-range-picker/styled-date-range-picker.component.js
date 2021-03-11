import { darken, fade, lighten, styled } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

const important = string => `${string} !important`;

export const StyledDateRangePicker = styled(DateRangePicker)(
  ({ theme: { palette, typography, transitions, spacing, shape } }) => ({
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
      //   display: block;
      //   width: 24px;
      //   height: 24px;
      margin: spacing(0, 2),
      //   padding: 0;
      //   border: 0;
      borderRadius: shape.borderRadius,
      background: palette.text.primary,
      '&:hover': {
        background: fade(palette.text.primary, 0.7),
      },
      '& i': {
        // borderColor: 'transparent',
        //     display: block;
        //     width: 0;
        //     height: 0;
        //     padding: 0;
        //     text-align: center;
        //     border-style: solid;
        //     margin: auto;
        //     transform: translate(-3px, 0px);
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
    // .rdrWeekDays {
    //   padding: 0 0.833em;
    // }
    // .rdrMonth{
    //   padding: 0 0.833em 1.666em 0.833em;
    //   .rdrWeekDays {
    //     padding: 0;
    //   }
    // }
    // .rdrMonths.rdrMonthsVertical .rdrMonth:first-child .rdrMonthName{
    //   display: none;
    // }
    // .rdrWeekDay {
    //   font-weight: 400;
    //   line-height: 2.667em;
    //   color: rgb(132, 144, 149);
    // }
    // .rdrDay {
    //   background: transparent;
    //   user-select: none;
    //   border: 0;
    //   padding: 0;
    //   line-height: 3.000em;
    //   height: 3.000em;
    //   text-align: center;
    //   color: #1d2429;
    //   &:focus {
    //     outline: 0;
    //   }
    // }
    // .rdrDayNumber {
    //   outline: 0;
    //   font-weight: 300;
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   bottom: 0;
    //   top: 5px;
    //   bottom: 5px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }
    // .rdrDayToday .rdrDayNumber span{
    //   font-weight: 500;
    //   &:after{
    //     content: '';
    //     position: absolute;
    //     bottom: 4px;
    //     left: 50%;
    //     transform: translate(-50%, 0);
    //     width: 18px;
    //     height: 2px;
    //     border-radius: 2px;
    //     background: #3d91ff;
    //   }
    // }
    // .rdrDayToday:not(.rdrDayPassive) {
    //   .rdrInRange, .rdrStartEdge, .rdrEndEdge, .rdrSelected{
    //     & ~ .rdrDayNumber span:after{
    //       background: #fff;
    //     }
    //   }
    // }
    // .rdrDay:not(.rdrDayPassive){
    //   .rdrInRange, .rdrStartEdge, .rdrEndEdge, .rdrSelected{
    //       & ~ .rdrDayNumber{
    //         span{
    //           color: rgba(255, 255, 255, 0.85);
    //         }
    //       }
    //   }
    // }
    // .rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge{
    //   background: currentColor;
    //   position: absolute;
    //   top: 5px;
    //   left: 0;
    //   right: 0;
    //   bottom: 5px;
    // }
    // .rdrSelected{
    //   left: 2px;
    //   right: 2px;
    // }
    // .rdrInRange{}
    // .rdrStartEdge{
    //   border-top-left-radius: 1.042em;
    //   border-bottom-left-radius: 1.042em;
    //   left: 2px;
    // }
    // .rdrEndEdge{
    //   border-top-right-radius: 1.042em;
    //   border-bottom-right-radius: 1.042em;
    //   right: 2px;
    // }
    // .rdrSelected{
    //   border-radius: 1.042em;
    // }
    // .rdrDayStartOfMonth, .rdrDayStartOfWeek{
    //   .rdrInRange, .rdrEndEdge{
    //     border-top-left-radius: 1.042em;
    //     border-bottom-left-radius: 1.042em;
    //     left: 2px;
    //   }
    // }
    // .rdrDayEndOfMonth, .rdrDayEndOfWeek{
    //   .rdrInRange,  .rdrStartEdge{
    //     border-top-right-radius: 1.042em;
    //     border-bottom-right-radius: 1.042em;
    //     right: 2px;
    //   }
    // }
    // .rdrDayStartOfMonth, .rdrDayStartOfWeek{
    //   .rdrDayInPreview, .rdrDayEndPreview{
    //     border-top-left-radius: 1.333em;
    //     border-bottom-left-radius: 1.333em;
    //     border-left-width: 1px;
    //     left: 0px;
    //   }
    // }
    // .rdrDayEndOfMonth, .rdrDayEndOfWeek{
    //   .rdrDayInPreview, .rdrDayStartPreview{
    //    border-top-right-radius: 1.333em;
    //    border-bottom-right-radius: 1.333em;
    //    border-right-width: 1px;
    //    right: 0px;
    //  }
    // }
    // .rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview{
    //   background: rgba(255, 255, 255, 0.09);
    //   position: absolute;
    //   top: 3px;
    //   left: 0px;
    //   right: 0px;
    //   bottom: 3px;
    //   pointer-events: none;
    //   border: 0px solid currentColor;
    //   z-index: 1;
    // }
    // .rdrDayStartPreview{
    //   border-top-width: 1px;
    //   border-left-width: 1px;
    //   border-bottom-width: 1px;
    //   border-top-left-radius: 1.333em;
    //   border-bottom-left-radius: 1.333em;
    //   left: 0px;
    // }
    // .rdrDayInPreview{
    //   border-top-width: 1px;
    //   border-bottom-width: 1px;
    // }
    // .rdrDayEndPreview{
    //   border-top-width: 1px;
    //   border-right-width: 1px;
    //   border-bottom-width: 1px;
    //   border-top-right-radius: 1.333em;
    //   border-bottom-right-radius: 1.333em;
    //   right: 2px;
    //   right: 0px;
    // }
    '& .rdrDefinedRangesWrapper': {
      //   font-size: 12px;
      //   width: 226px;
      //   border-right: solid 1px #eff2f7;
      background: palette.background.default,
      //   .rdrStaticRangeSelected{
      //     color: currentColor;
      //     font-weight: 600;
      //   }
    },
    '& .rdrStaticRange': {
      //   border: 0;
      //   cursor: pointer;
      //   display: block;
      //   outline: 0;
      //   border-bottom: 1px solid #eff2f7;
      //   padding: 0;
      background: palette.background.default,
      //   &:hover, &:focus{
      //     .rdrStaticRangeLabel{
      //       background: #eff2f7;
      //     }
      //   }
    },
    // .rdrStaticRangeLabel{
    //   display: block;
    //   outline: 0;
    //   line-height: 18px;
    //   padding: 10px 20px;
    //   text-align: left;
    // }
    // .rdrInputRanges{
    //   padding: 10px 0;
    // }
    // .rdrInputRange{
    //   align-items: center;
    //   padding: 5px 20px;
    // }
    // .rdrInputRangeInput{
    //   width: 30px;
    //   height: 30px;
    //   line-height: 30px;
    //   border-radius: 4px;
    //   text-align: center;
    //   border: solid 1px rgb(222, 231, 235);
    //   margin-right: 10px;
    //   color: rgb(108, 118, 122);
    //   &:focus, &:hover{
    //     border-color: rgb(180, 191, 196);
    //     outline: 0;
    //     color: #333;
    //   }
    // }
    // .rdrCalendarWrapper:not(.rdrDateRangeWrapper) .rdrDayHovered .rdrDayNumber:after{
    //   content: '';
    //   border: 1px solid currentColor;
    //   border-radius: 1.333em;
    //   position: absolute;
    //   top: -2px;
    //   bottom: -2px;
    //   left: 0px;
    //   right: 0px;
    //   background: transparent;
    // }
    // .rdrDayPassive{
    //   pointer-events: none;
    //   .rdrDayNumber span{
    //     color: #d5dce0;
    //   }
    //   .rdrInRange, .rdrStartEdge, .rdrEndEdge, .rdrSelected, .rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview{
    //     display: none;
    //   }
    // }
    // .rdrDayDisabled {
    //   background-color: rgb(248, 248, 248);
    //   .rdrDayNumber span{
    //     color: #aeb9bf;
    //   }
    //   .rdrInRange, .rdrStartEdge, .rdrEndEdge, .rdrSelected, .rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview{
    //     filter: grayscale(100%) opacity(60%);
    //   }
    // }
    // .rdrMonthName{
    //   text-align: left;
    //   font-weight: 600;
    //   color: #849095;
    //   padding: 0.833em;
    // }
  }),
);

// export const StyledDateRangePicker = styled(DateRangePicker)(
//   ({ theme: { palette, typography, transitions } }) => ({
//     fontFamily: important(typography.fontFamily),
//     '& .rdrDefinedRangesWrapper': {
//       backgroundColor: palette.background.default,
//       borderColor: palette.divider,
//       '& .rdrStaticRange': {
//         color: palette.text.primary,
//         backgroundColor: palette.background.default,
//         borderColor: palette.divider,
//         transition: transitions.create(['color'], {
//           duration: transitions.duration.short,
//         }),
//         '& .rdrStaticRangeLabel': {
//           transition: transitions.create(['background-color'], {
//             duration: transitions.duration.short,
//           }),
//           ...typography.body1,
//         },
//         '&:hover': {
//           '& .rdrStaticRangeLabel': {
//             backgroundColor: palette.action.hover,
//           },
//         },
//         '&.rdrStaticRangeSelected': {
//           color: `${palette.primary.main} !important`,
//         },
//       },
//     },
//     '& .rdrMonthAndYearPickers select': {
//       color: palette.text.primary,
//       background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF' width='18px' height='18px'><path d='M0 0h24v24H0z' fill='none'/><path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'/></svg>") no-repeat`,
//       backgroundPosition: 'right 0px center',
//       '&:hover': {
//         backgroundColor: palette.action.hover,
//       },
//       '& option': {
//         color: palette.common.black,
//       },
//     },
//     '& .rdrCalendarWrapper': {
//       backgroundColor: palette.background.default,
//       '& .rdrMonths': {
//         '& .rdrMonth': {
//           '& .rdrMonthName': {
//             color: palette.text.primary,
//           },
//           '& .rdrWeekDays': {
//             '& .rdrWeekDay': {
//               color: palette.text.primary,
//             },
//           },
//         },
//       },
//     },
//     '& .rdrDay': {
//       '& .rdrDayInPreview, & .rdrDayStartPreview, & .rdrDayEndPreview': {
//         borderColor: palette.primary.main,
//         backgroundColor: palette.action.hover,
//       },
//       '& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge': {
//         backgroundColor: palette.primary.main,
//         '& ~ .rdrDayNumber': {
//           '& span': {
//             color: palette.secondary.main,
//             '&::after': {
//               backgroundColor: palette.secondary.main,
//             },
//           },
//         },
//       },
//       '& .rdrDayNumber': {
//         '& span': {
//           color: palette.text.primary,
//           '&::after': {
//             backgroundColor: palette.primary.main,
//           },
//         },
//       },
//       '&.rdrDayPassive': {
//         opacity: 0,
//       },
//     },
//   }),
// );
