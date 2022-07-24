import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import {TextField} from "@mui/material";
import {Box} from "@material-ui/core";


export default function AddCourseDailog(props) {
    const {onClose, openCourseDailog, addCourse} = props;

    const [courseName, setCourseName]= React.useState('');
    const [loading,setLoading] = React.useState(false);

    const handleClose = () => {
        onClose();
    };

    const handelSubmit = async ()=>{
        setLoading(true);
       await addCourse({course: courseName});
       setLoading(true);
    }

    return (
        <Dialog onClose={handleClose} open={openCourseDailog}>
            <Box sx={{minWidth: '500px', display:'flex', justifyContent:'center'}}>
                <Box sx={{minWidth: '300px', display:'flex', justifyContent:'center', flexDirection:'column', gap:'1.5em', margin:'20px', color:'black'}}>
                    <h3 style={{fontWeight: '700'}}>Add Course</h3>
                    <TextField
                        value={courseName}
                        onChange={(e) =>setCourseName(e.target.value)}
                        className='flex-1'
                        label='Enter Course name here'/>
                    <Button variant={"contained"}
                            onClick={handelSubmit}
                            disabled={!courseName || loading}
                    >
                        {loading ? <CircularProgress color='inherit' size={25}/> : 'Submit'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}