import React, { useMemo, useState } from 'react';

import { Button, Checkbox, makeStyles } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { useSortBy } from 'react-table';

import { Table } from 'components/table/table.component';

import { deleteProposal } from '../nature-scot.slice';

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

const AssessmentTable = ({ data, handleEditAssessment }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [selectedAssessments, setSelectedAssessments] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        id: 'id',
        Cell: ({ row }) => {
          const isChecked = selectedAssessments.find(
            assessment => assessment.id === row.original.id,
          );

          return (
            <Checkbox
              checked={isChecked}
              onClick={() => {
                const assessmentExists = selectedAssessments.find(
                  assessment => assessment.id === row.original.id,
                );

                const newAssessments = assessmentExists
                  ? selectedAssessments.filter(
                      assessment => assessment.id !== assessmentExists.id,
                    )
                  : [...selectedAssessments, row.original];

                setSelectedAssessments(newAssessments);
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
        accessor: 'modified',
        id: 'modifiedDate',
        Cell: ({ value }) => format(new Date(value), DATE_FORMAT),
      },
      {
        Header: 'Time',
        accessor: 'modified',
        id: 'modifiedTime',
        Cell: ({ value }) => format(new Date(value), TIME_FORMAT),
      },
      {
        Header: '',
        accessor: 'null',
        id: 'button',
        Cell: ({
          row: {
            original: { id },
          },
        }) => {
          return (
            <div className={styles.actions}>
              <Button
                size="small"
                variant="text"
                className={styles.actionButton}
                onClick={() => handleEditAssessment(id)}
              >
                View/Modify
              </Button>
            </div>
          );
        },
      },
    ],
    [
      selectedAssessments,
      styles.actions,
      styles.actionButton,
      handleEditAssessment,
    ],
  );

  const exportAs = type =>
    console.log('Export: ', selectedAssessments, ' as: ', type);

  const deleteAssessment = () =>
    selectedAssessments.forEach(assessment =>
      dispatch(deleteProposal(assessment)),
    );

  const isAssessmentSelected = selectedAssessments.length > 0;

  return (
    <div>
      <Table
        data={data}
        columns={columns}
        noDataMessage="No saved Assessments for this Area of Interest"
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
          disabled={!isAssessmentSelected}
        >
          Export as PDF
        </Button>
        <Button
          onClick={() => exportAs(FORMATS.CSV)}
          size="small"
          disabled={!isAssessmentSelected}
        >
          Export as CSV
        </Button>
        <Button
          onClick={() => deleteAssessment()}
          size="small"
          disabled={!isAssessmentSelected}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AssessmentTable;
