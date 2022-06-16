import React from 'react';

import { TableCell } from '@astrosat/astrosat-ui';

import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import {
  IMPACT_SUMMARY_LEGEND_DATA,
  SCORE_LEGENDS,
} from '../nature-scotland.constants';
import NeutralIcon from './neutral-icon';

const useStyles = makeStyles(theme => ({
  minus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High negative'],
  },
  minus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium negative'],
  },
  minus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low negative'],
  },
  zero: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Neutral'],
  },
  plus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low positive'],
  },
  plus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium positive'],
  },
  plus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High positive'],
  },
}));

const ScoringDisplay = ({ score, legend = false }) => {
  // takes an integer score in range [-3,3] and renders out a series of icons
  // wrapped in a table cell, with colour styles applied.

  const styles = useStyles();

  const getStrengthText = (styles, strength) => {
    const colorScale = [
      styles.minus3,
      styles.minus2,
      styles.minus1,
      styles.zero,
      styles.plus1,
      styles.plus2,
      styles.plus3,
    ];

    let starArray = [];
    for (let i = 0; i < Math.abs(strength); i++) {
      starArray.push('*');
    }
    const strengthIndex = strength + 3;
    const legendString = SCORE_LEGENDS[strengthIndex];

    // custom SVG for neutral. Not ideal, but desired icon was not in v4 MUI...
    if (strength === 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          <NeutralIcon />
          <span>{legend ? legendString : null}</span>
        </TableCell>
      );
    }
    if (strength < 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <RemoveCircle key={index} />
          ))}
          <span>{legend ? legendString : null}</span>
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map(item => (
            <AddCircle key={item} />
          ))}
          <span>{legend ? legendString : null}</span>
        </TableCell>
      );
    }
  };

  const result = getStrengthText(styles, score);
  return result;
};

export default ScoringDisplay;
