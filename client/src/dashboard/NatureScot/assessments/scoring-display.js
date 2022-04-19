import React from 'react';

import { TableCell } from '@astrosat/astrosat-ui';

import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { IMPACT_SUMMARY_LEGEND_DATA } from '../nature-scotland.constants';
import NeutralIcon from './neutral-icon';

const useStyles = makeStyles(theme => ({
  minus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High -ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  minus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium -ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  minus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low -ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  zero: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Neutral'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  plus1: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Low +ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  plus2: {
    color: IMPACT_SUMMARY_LEGEND_DATA['Medium +ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  plus3: {
    color: IMPACT_SUMMARY_LEGEND_DATA['High +ve'],
    border: `1px solid ${theme.palette.secondary.main}`,
  },
}));

const ScoringDisplay = ({ score }) => {
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
    console.log(`${strength}`, starArray);
    const strengthIndex = strength + 3;

    // custom SVG for neutral. Not ideal, but desired icon was not in v4 MUI...
    if (strength === 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          <NeutralIcon />
        </TableCell>
      );
    }
    if (strength < 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map(item => (
            <RemoveCircle key={item} />
          ))}
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map(item => (
            <AddCircle key={item} />
          ))}
        </TableCell>
      );
    }
  };

  const result = getStrengthText(styles, score);
  return result;
};

export default ScoringDisplay;
