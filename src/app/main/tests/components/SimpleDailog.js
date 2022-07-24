import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';


export default function SimpleDialog(props) {
    const { onClose, selectedValue, open, result, isTeacher } = props;
    const {correctAnswers, filledAnswer} = selectedValue;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
           {result >= 50 || isTeacher?
           <>
               <DialogTitle style={{textDecorationLine: "underline"}}>Correct Answers</DialogTitle>
               <List sx={{ pt: 0 }}>
                   {correctAnswers[0]?.answer?.map((value) => (
                       <ListItem button key={value}>
                           <ListItemText primary={value} />
                       </ListItem>
                   ))}
               </List>

               <DialogTitle style={{textDecorationLine: "underline"}}>Your Answers</DialogTitle>
               <List sx={{ pt: 0 }}>
                   {filledAnswer?.map((value) => (
                       <ListItem button  key={value}>
                           <ListItemText primary={value } />
                       </ListItem>
                   ))}
               </List>
           </> :
           <> <DialogTitle>You need to get at least 50% to view the correct answer</DialogTitle></>}
        </Dialog>
    );
}