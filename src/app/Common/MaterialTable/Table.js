import React from 'react';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterIcon from '@material-ui/icons/FilterList';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import {TablePagination} from '@material-ui/core';
import './style.css';

export default function Table({
  icons,
  options,
  components,
  pagination = {},
  style,
  ...rest
}) {
  return (
    <MaterialTable
      {...rest}
      icons={{
        Search: React.forwardRef((props, ref) => (
          <SearchIcon color="action" {...props} ref={ref}></SearchIcon>
        )),
        ResetSearch: React.forwardRef((props, ref) => (
          <DeleteIcon color="action" ref={ref}></DeleteIcon>
        )),
        SortArrow: React.forwardRef((props, ref) => (
          <FilterIcon color="action" ref={ref}></FilterIcon>
        )),
        NextPage: React.forwardRef((props, ref) => (
          <ChevronRight color="action" ref={ref} />
        )),
        PreviousPage: React.forwardRef((props, ref) => (
          <ChevronLeft color="action" ref={ref} />
        )),
        ...icons,
      }}
      options={{
        search: true,
        sorting: true,
        paging: true,
        showFirstLastPageButtons: false,
        emptyRowsWhenPaging: true,
        // pageSize: 6,
        pageSizeOptions: [10, 50, 200],
        rowStyle: {
          boxShadow: '0px 0px 10px 1px #6199F229',
          borderRadius: '10px',
        },
        // headerStyle: {
        //   backgroundColor: '#6199F20D',
        //   fontWeight: 'bold',
        //   fontSize: '1.2rem',
        // },
        // cellStyle: {},
        // searchFieldStyle: {
        //   boxShadow: '0px 3px 18px 2px #6199f224',
        //   borderRadius: '10px',
        //   padding: '0.4rem',
        // },
        actionsColumnIndex: -1,
        ...options,
      }}
      // style={{
      //   width: '100%',
      //   minWidth: '30rem',
      //   marginTop: '1rem',
      //   color: 'inherit',
      //   fontFamily: 'Poppins',
      //   ...style,
      // }}
      components={{
        Pagination: React.forwardRef((props, ref) => {
          return (
            <TablePagination
              className="Material-table-pagination"
              colSpan={props.colSpan}
              count={pagination.count || props.count}
              rowsPerPage={pagination.rowsPerPage || props.rowsPerPage}
              rowsPerPageOptions={
                props.rowsPerPageOptions || pagination.rowsPerPageOptions
              }
              page={pagination.page || props.page}
              onChangePage={pagination.onChangePage || props.onChangePage}
              onChangeRowsPerPage={
                pagination.onChangeRowsPerPage || props.onChangePage
              }
              labelRowsPerPage="rows"
              ref={ref}
              color="action"
            />
          );
        }),
        ...components,
      }}
    />
  );
}
