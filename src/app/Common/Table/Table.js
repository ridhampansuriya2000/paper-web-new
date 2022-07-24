import React from "react";
import { DataGrid } from '@material-ui/data-grid';
import withStyles from '@material-ui/core/styles/withStyles';

const StyledDataGrid = withStyles({
    root: {
        '& .MuiDataGrid-renderingZone': {
            maxHeight: 'none !important',
        },
        '& .MuiDataGrid-cell': {
            lineHeight: 'unset !important',
            maxHeight: 'none !important',
            whiteSpace: 'normal',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
        },
        '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
            maxHeight: 'none !important',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
        },
    },
})(DataGrid);


const Table = ({columns,pageSize,height,...rest})=> {

    return (
        <div style={{ height: height, width: '100%' }}>
            <StyledDataGrid
                VerticalContentAlignment="Center"
                HorizontalContentAlignment="Center"
                AutoGenerateColumns="False"
                rows={rest.rows || []}
                columns={columns}
                pageSize={pageSize || 10}
                checkboxSelection
                disableSelectionOnClick
            />
        </div>
    );
}
export default Table;