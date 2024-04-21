import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const AdminNames = ["Felhasználó", "Adminisztrátor", "Tulajdonos"]

export default function Permissions() {
    const navigate = useNavigate()
    const [Email, setEmail] = React.useState("")
    const [EmailError, setEmailError] = React.useState("")
    const [search, setSearch] = React.useState({ID:'-', Email: "-", AdminLevel: "-"})
    const [newAdmin, setNewAdmin] = React.useState(0);

    const handleChange = (event) => {
      setNewAdmin(event.target.value);
    };

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
                if(sdata.payload.AdminLevel < 2){
                    navigate("/dashboard/notifications")
                    return false
                }
        })
    }, [navigate])
    
    function clearError(){
        setEmailError("")
    }

    function handleInputChange(e,func){
        func(e.target.value)
        clearError()
    }

    function handleNewAdminLevel() {
        fetch('http://127.0.0.1:6969/api/v1/users/changeAdminLevel', {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: Email,
                    adminlevel: newAdmin
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'Refresh': {window.location.reload(false); return;}
                    case 'Success': {break;}
                    default: {break;}
                }
                if(data.payload === null){
                    setEmailError("Nem található ilyen felhasználó!")
                    return false
                }
                setSearch(data.payload)
                setNewAdmin(data.payload.AdminLevel)
        })
        clearError()
    }

    function handleSearch(){
        fetch('http://127.0.0.1:6969/api/v1/users/getUser', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: Email,
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    default: {break;}
                }
                if(data.payload === null){
                    setEmailError("Nem található ilyen felhasználó!")
                    return false
                }
                setSearch(data.payload)
                setNewAdmin(data.payload.AdminLevel)
        })
    }

    return(
        <div className='flex flex-col items-center'>
            <Typography variant="h1" className='!text-6xl'>Jogosultság kezelő</Typography>
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
            <Button variant="outlined" className='!mb-16' onClick={handleSearch}>Keresés</Button>

            <Typography variant="h4">Azonosító: {search.ID}</Typography>
            <Typography variant="h4">Email: {search.Email}</Typography>
            <Typography variant="h4">Adminisztrátori szint: {AdminNames[search.AdminLevel] ? '['+search.AdminLevel+']'+AdminNames[search.AdminLevel] : "-"}</Typography>
            
            <div className='flex flex-row items-center'>
                <Typography variant="h4">Új Adminisztrátori szint:</Typography>
                <Select
                    labelId="newAdmin"
                    id="newAdmin"
                    value={newAdmin}
                    label="Szint"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Felhasználó</MenuItem>
                    <MenuItem value={1}>Adminisztrátor</MenuItem>
                    <MenuItem value={2}>Tulajdonos</MenuItem>
                </Select>
            </div>
            <Button onClick={handleNewAdminLevel} variant="outlined" className="!mt-8" disabled={search.AdminLevel === "-" || search.AdminLevel === newAdmin}>Alkalmazás</Button>
        </div>

    )
}