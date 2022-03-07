import React, { useMemo, useState } from 'react';

import { Button, Checkbox, makeStyles } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useSortBy } from 'react-table';

import { Table } from 'components/table/table.component';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  actionButton: {
    padding: 'unset',
  },
  buttons: {
    '& > *': {
      margin: '1rem',
    },
  },
}));

const DATE_FORMAT = 'dd/MM/yyyy';
const TIME_FORMAT = 'HH:mm';

const FORMATS = {
  PDF: 'PDF',
  CSV: 'CSV',
};

const AssessmentTable = ({ data }) => {
  const styles = useStyles();

  const [assessments, setAssessments] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        id: 'id',
        Cell: ({ row }) => {
          const isChecked = assessments.find(
            assessment => assessment.id === row.original.id,
          );

          return (
            <Checkbox
              checked={isChecked}
              onClick={event => {
                const assessmentExists = assessments.find(
                  assessment => assessment.id === row.original.id,
                );

                const newAssessments = assessmentExists
                  ? assessments.filter(
                      assessment => assessment.id !== assessmentExists.id,
                    )
                  : [...assessments, row.original];

                setAssessments(newAssessments);
              }}
            />
          );
        },
      },
      {
        Header: 'Assessment Name',
        accessor: 'name',
        id: 'name',
      },
      {
        Header: 'Date',
        accessor: 'date',
        id: 'date',
        Cell: ({ value }) => format(new Date(value), DATE_FORMAT),
      },
      {
        Header: 'Time',
        accessor: 'time',
        id: 'time',
        Cell: ({ value }) => format(new Date(value), TIME_FORMAT),
      },
      {
        Header: 'Version',
        accessor: 'version',
        id: 'version',
      },
      {
        Header: '',
        accessor: 'null',
        id: 'button',
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <Button
              size="small"
              variant="text"
              className={styles.actionButton}
              onClick={event => console.log('View Clicked: ', value, event)}
            >
              View
            </Button>
            <Button
              size="small"
              variant="text"
              className={styles.actionButton}
              onClick={event => console.log('Modify Clicked: ', value, event)}
            >
              Modify
            </Button>
          </div>
        ),
      },
    ],
    [assessments, styles.actions, styles.actionButton],
  );

  const exportAs = type => console.log('Export: ', assessments, ' as: ', type);

  const deleteAssessment = () =>
    console.log('Delete Impact Assessment: ', assessments);

  return (
    <div>
      <Table
        data={data}
        columns={columns}
        noDataMessage="No saved Assessments"
        pluginHooks={[useSortBy]}
        getCellProps={cell => ({
          width: cell.column.id === 'id' ? '10%' : '30%',
        })}
        tableOptions={{
          initialState: {
            sortBy: [
              { id: 'name', desc: false },
              { id: 'type', desc: false },
              { id: 'distance', desc: false },
            ],
          },
          disableSortRemove: true,
          autoResetPage: false,
        }}
      ></Table>

      <div className={styles.buttons}>
        <Button
          onClick={() => exportAs(FORMATS.PDF)}
          size="small"
          disabled={assessments.length < 1}
        >
          Export as PDF
        </Button>
        <Button
          onClick={() => exportAs(FORMATS.CSV)}
          size="small"
          disabled={assessments.length < 1}
        >
          Export as CSV
        </Button>
        <Button
          onClick={() => deleteAssessment()}
          size="small"
          disabled={assessments.length < 1}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AssessmentTable;
