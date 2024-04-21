import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import { Button, Icon, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc);
dayjs.extend(customParseFormat)

export default function Tasks(){
    const navigate = useNavigate()
    const [fEmail, setFEmail] = React.useState(null)
    const [Email, setEmail] = React.useState("")
    const [EmailError, setEmailError] = React.useState("")
    const [Data, setData] = React.useState([])

    const [editRow, setEditRow] = React.useState(null)
    const [editTime, setEditTime] = React.useState()
    const [editName, setEditName] = React.useState()

    const [newTime, setNewTime] = React.useState()
    const [newName, setNewName] = React.useState()

    useEffect(() => {
        fetch('http://127.0.0.1:6969/api/v1/users/userData', {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => response.json()).then((sdata) => {
                if(sdata.payload === undefined){
                    navigate("/login/login")
                    return false
                }
                if(sdata.payload.AdminLevel < 1){
                    navigate("/dashboard/notifications")
                    return false
                }
        })
    }, [navigate, Data])

    function clearError(){
        setEmailError("")
    }

    function handleInputChange(e,func){
        func(e.target.value)
        clearError()
    }

    function handleSearch(solidMail){
        setEditRow(null)
        setData([])
        fetch('http://127.0.0.1:6969/api/v1/task/getUserTask', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: (solidMail ? fEmail : Email),
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'noUser': {setEmailError("Nem található ilyen felhasználó!");setFEmail(null); return;}
                    default: {break;}
                }
                setData(data.payload)
                if(!solidMail){
                    setFEmail(Email)
                }
        })
    }

    const deleteTask = (ID) => {
        fetch('http://127.0.0.1:6969/api/v1/task/delete', {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    ID: Data[ID].ID,
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'noUser': {setEmailError("Nem található ilyen felhasználó!"); return;}
                    default: {break;}
                }
                handleSearch(true)
                
        })
    }

    function addTask(){
        fetch('http://127.0.0.1:6969/api/v1/task/create', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    time: newTime,
                    email: fEmail
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'noUser': {setEmailError("Nem található ilyen felhasználó!"); return;}
                    default: {break;}
                }
                handleSearch(true)
                
        })   
    }

    const editTask = () => {
        fetch('http://127.0.0.1:6969/api/v1/task/edit', {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    ID: Data[editRow].ID,
                    Name: editName,
                    Time: editTime

                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'noUser': {setEmailError("Nem található ilyen felhasználó!"); return;}
                    default: {break;}
                }
                const temp = Data
                temp[editRow].Name = editName
                temp[editRow].Time = editTime
                setData(temp)
                setEditRow()
                
        })
    }

    return(
        <div className='flex flex-col items-center'>
            <Typography variant="h1" className='!text-6xl'>Feladatkezelő</Typography>
            <TextField
                id="Email"
                label="Email"
                variant='outlined'
                margin='normal'
                className='w-5/6 lg:w-3/6'
                onChange={(e) => handleInputChange(e, setEmail)} 
                error={(EmailError !== "")}
                helperText={EmailError}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>,
                }}/>
            <Button variant="outlined" className='!mb-16' onClick={() => handleSearch(false)}>Keresés</Button>
            <Typography variant="h2" className='!text-4xl !mb-3'>Hozzáadás</Typography>
            <div className='flex flex-col justify-center lg:flex-row mb-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker ampm={false} timezone='UTC' onAccept={(e) => setNewTime(e)}/>
                </LocalizationProvider>
                <TextField className='lg:!ml-8 !mt-2 lg:!mt-0' onChange={(e) => setNewName(e.target.value)} label='Leírás' />
            </div>
            <Button className='!mt-2 lg:!mt-0' variant='outlined' disabled={fEmail === null} onClick={addTask} >Hozzáadás</Button>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Leírás</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Data.map((row, index) => {
                        if(editRow === index){
                            return (
                                <TableRow
                                key={row.ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker defaultValue={dayjs(row.Time)} ampm={false} timezone='UTC' onAccept={(e) => setEditTime(e)}/>
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
                                        <TextField defaultValue={row.Name} onChange={(e) => setEditName(e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton aria-label="edit" color="success" onClick={editTask}>
                                            <DoneIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                            
                        }else{
                            return (
                                <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {dayjs(row.Time).utc().format("YYYY. MM. DD. HH:mm")}
                                    </TableCell>
                                    <TableCell>
                                        {row.Name}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setEditRow(index)} aria-label='edit' color="info">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="remove" color="error" onClick={() => deleteTask(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                            })}
                </TableBody>
            </Table>


        </div>

    )

}