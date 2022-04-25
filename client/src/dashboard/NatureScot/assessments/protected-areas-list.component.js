import React from 'react';

import {
  Collapse,
  Link,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TriangleIcon,
  Typography,
  makeStyles,
  withStyles,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#4e5d65',
    color: '#fff',
    marginTop: '4rem',
    border: 'solid 3px #333f48',
    borderRadius: '0.2rem',
    boxShadow: '2px 2px 5px #333f48',
    maxHeight: '550px',
    overflow: 'auto',
  },
  strapline: {
    width: '92%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
    '& > *': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  section: {
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sectionHeading: {
    backgroundColor: '#7c8990',
    borderRadius: '0.3rem',
    margin: '2rem 0 3rem 0',
    padding: '1rem',
  },
  feature: {
    backgroundColor: '#333f48',
    margin: '0.3rem',
    borderRadius: '0.3rem',
    padding: '2rem',
  },
  icon: {
    fontSize: 'inherit',
    marginRight: theme.spacing(1),
    transform: 'rotate(90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.sharp,
    }),
    '&$open': {
      transform: 'rotate(180deg)',
    },
  },
  open: {},
  list: {
    margin: '0rem 2rem 2rem 2rem',
  },
  listItem: {
    padding: '2rem',
    boxShadow: `0 5px 9px -2px ${theme.palette.secondary.main}`,
    marginBottom: '1rem',
  },
  item: {
    color: '#acb1b5',
  },
  heading: {
    width: '100%',
  },
}));

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    marginTop: '5rem',
    '& *': {
      margin: '0.5rem 0.5rem 0.5rem 0.5rem',
    },
  },
}));

const AreaListItem = ({ onClick, openSections, area }) => {
  const styles = useStyles();

  return (
    <ListItem button onClick={onClick}>
      {area.areas.length > 0 ? (
        openSections.includes(area.title) ? (
          <TriangleIcon
            className={clsx(styles.icon, { [styles.open]: true })}
          />
        ) : (
          <TriangleIcon
            className={clsx(styles.icon, { [styles.open]: false })}
          />
        )
      ) : null}
      <div className={styles.heading}>
        <span className={styles.strapline}>
          <ListItemText
            primaryTypographyProps={{
              display: 'inline',
            }}
            primary={area.title}
            secondaryTypographyProps={{
              component: 'span',
              display: 'inline',
            }}
            secondary={
              <Link href={area.link} target="_blank" rel="noreferrer noopener">
                View on SiteLink
              </Link>
            }
          />
        </span>
        <ListItemText secondary={area.strapline} />
      </div>
    </ListItem>
  );
};

const SectionListItem = ({ onClick, openSections, section }) => {
  const styles = useStyles();

  return (
    <ListItem className={styles.listItem} button onClick={onClick}>
      {openSections.includes(section.name) ? (
        <TriangleIcon
          className={clsx(styles.icon, {
            [styles.open]: true,
          })}
        />
      ) : (
        <TriangleIcon
          className={clsx(styles.icon, {
            [styles.open]: false,
          })}
        />
      )}
      <ListItemText primary={section.name} />
    </ListItem>
  );
};

const SectionCollapse = ({ openSections, section }) => {
  const styles = useStyles();

  return (
    <Collapse
      in={openSections.includes(section.name)}
      timeout="auto"
      unmountOnExit
    >
      <List component="div" className={styles.list} disablePadding>
        <ListItem className={styles.sectionHeading} component="div">
          {section.heading}
        </ListItem>

        <SectionTable headers={section.columnHeadings} data={section.columns} />

        {section.notes ? <Notes section={section} /> : null}
      </List>
    </Collapse>
  );
};

const Notes = ({ section }) => {
  const styles = useStyles();

  return (
    <List component="div" disablePadding>
      <span>Notes</span>
      {section?.notes?.map(note => (
        <ListItem key={note} className={styles.feature}>
          <ListItemText className={styles.item} primary={note} />
        </ListItem>
      ))}
    </List>
  );
};

const StyledTableRow = withStyles(theme => ({
  root: {
    border: '0.5rem solid #4e5d65',
    backgroundColor: theme.palette.secondary.main,
    '& :first-child': {
      borderTopLeftRadius: '1.3rem',
      borderBottomLeftRadius: '1.3rem',
    },
    '& :last-child': {
      borderTopRightRadius: '1.3rem',
      borderBottomRightRadius: '1.3rem',
    },
    '& :nth-of-type(even)': {
      color: '#acb1b5',
    },
  },
}))(TableRow);

const StyledTableCell = withStyles(theme => ({
  root: {
    margin: '0.3rem',
    padding: '2rem',
  },
}))(TableCell);

const SectionTable = ({ headers, data }) => (
  <Table>
    <TableHead>
      <TableRow>
        {headers.map(header => (
          <TableCell key={header}>{header}</TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {data.map(feature => (
        <StyledTableRow key={feature.label}>
          {Object.keys(feature).map(key => (
            <StyledTableCell key={key}>{feature[key]}</StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
);

const ProtectedAreasList = ({ areas }) => {
  const styles = useStyles();

  const [openSections, setOpenSections] = React.useState([]);

  const handleClick = title => {
    // Is section already open, if it exists, then it is.
    const isOpen = openSections.includes(title);
    const newSections = isOpen
      ? openSections.filter(section => section !== title)
      : [...openSections, title];
    setOpenSections(newSections);
  };

  return (
    <ChartWrapper title="Protected Areas" info="Protected Areas Description">
      <Typography>
        Your area of interest overlaps with or is nearby the following
        designated protected areas:
      </Typography>

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={styles.root}
      >
        {areas
          ? areas.map(area => (
              <div key={area.title}>
                <AreaListItem
                  onClick={() => handleClick(area.title)}
                  openSections={openSections}
                  area={area}
                />

                {area.areas.length > 0 ? (
                  <Collapse
                    in={openSections.includes(area.title)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItem button className={styles.row}>
                        {area.areas.map(section => (
                          <div className={styles.section} key={section.name}>
                            <SectionListItem
                              onClick={() => handleClick(section.name)}
                              openSections={openSections}
                              section={section}
                            />

                            <SectionCollapse
                              openSections={openSections}
                              section={section}
                            />
                          </div>
                        ))}
                      </ListItem>
                    </List>
                  </Collapse>
                ) : null}
              </div>
            ))
          : null}
      </List>
    </ChartWrapper>
  );
};

export const ProtectedAreasListSkeleton = () => {
  const styles = skeletonStyles();

  return (
    <ChartWrapperSkeleton>
      <div className={styles.areas}>
        <Skeleton variant="rect" width={810} height={80} />
        <Skeleton variant="rect" width={810} height={80} />
        <Skeleton variant="rect" width={810} height={80} />
        <Skeleton variant="rect" width={810} height={80} />
        <Skeleton variant="rect" width={810} height={80} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export default ProtectedAreasList;
