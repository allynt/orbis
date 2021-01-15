import { makeStyles } from '@astrosat/astrosat-ui';

export const useDocumentStyles = makeStyles(theme => ({
  text: {
    ...theme.typography.body1,
  },
  textHeader: {
    ...theme.typography.h1,
    margin: theme.spacing(4, 0, 2, 0),
  },
  title: {
    ...theme.typography.h1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
  },
  description: {
    margin: theme.spacing(2, 0),
  },
  list: {
    display: 'block',
    marginLeft: theme.spacing(4),
    '& span': {
      fontWeight: theme.typography.fontWeightBold,
      marginRight: theme.spacing(1),
      minWidth: '7.5rem',
    },
  },
  listItem: {
    display: 'flex',
    margin: theme.spacing(2, 0),
  },
  textSectionHeader: {
    margin: theme.spacing(2, 0),
  },

  table: {
    marginTop: theme.spacing(2),
    border: '1px solid #000',
  },
  td: {
    border: '1px solid #000',
    padding: theme.spacing(2),
  },

  // .schedule1 {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   padding: 2rem;
  //   font-size: 1.75rem;
  // }
  // .schedule1 h1 {
  //   margin-bottom: 1rem;
  // }
  // .link {
  //   color: blue;
  //   text-decoration: underline;
  //   cursor: pointer;
  // }
  //
}));
