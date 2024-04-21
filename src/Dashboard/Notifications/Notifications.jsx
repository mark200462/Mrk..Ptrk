import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

export default function Notifications(){
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    
    useEffect(() => {
        fetch('http://127.0.0.1:6969/api/v1/notification/get', {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'Success': {setNotifications(data.payload.Notifications); return;}
                    default: {return;}
                }

        })
    }, [setNotifications,navigate])

    function deleteNotification(ID){
        fetch('http://127.0.0.1:6969/api/v1/notification/delete', {
            method: "DELETE",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ID: notifications[ID].ID,
            })
        }).then((response) => response.json()).then((data) => {
            switch(data.message){
                case 'toLogin': {navigate("/login/login"); return;}
                case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                default: {break;}
            }
            
            const temp = [...notifications]
            temp.splice(ID, 1);
            setNotifications(temp)
        })
    }
    
    return(
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Dátum</TableCell>
                    <TableCell>Leírás</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {notifications.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{dayjs(row.Time).utc().format("YYYY. MM. DD. HH:mm")}</TableCell>
                        <TableCell>{row.Description}</TableCell>
                        <TableCell>
                            <IconButton aria-label="remove" color="error" onClick={() => deleteNotification(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}