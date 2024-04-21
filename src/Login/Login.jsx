import React from 'react';
import {useNavigate} from "react-router-dom"
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';



export default function Login() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);

    const [Email, setEmail] = React.useState("")
    const [Password, setPassword] = React.useState("")

    const [EmailError, setEmailError] = React.useState("")
    const [PasswordError, setPasswordError] = React.useState("")

    function clearError(){
        setEmailError("")
        setPasswordError("")
    }

    function handleInputChange(e,func){
        func(e.target.value)
        clearError()
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    function handleLogin() {
        clearError()
        function isEmpty(str) {
            return !str.trim().length;
        }

        let error = false

        if (isEmpty(Email)){
            setEmailError("Ne hagyj üres mezőt!")
            error = true
        }
        if (isEmpty(Password)){
            setPasswordError("Ne hagyj üres mezőt!")
            error = true
        }

        if(error){
            return false
        }

        fetch('http://127.0.0.1:6969/api/v1/users/login/', {
            method: "POST",
            credentials: 'include',  
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: Email,
                password: Password
            })
        }).then((response) => response.json()).then((data) => {
            switch(data.message){
                case "credError": {setEmailError("Hibás email cím vagy jelszó!"); setPasswordError("Hibás email cím vagy jelszó"); break}
                case "Success": {navigate("../../dashboard/notifications"); break;}
                default: break
            }
        })
    }

    return(
        <React.Fragment>
            <form className='flex flex-col w-[95%] h-fit items-center'>
                <TextField
                id="Email"
                label="Email"
                variant='outlined'
                margin='normal'
                className='w-5/6 lg:w-4/6'
                onChange={(e) => handleInputChange(e, setEmail)} 
                error={(EmailError !== "")}
                helperText={EmailError}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>,
                }}/>
                <TextField 
                id="Password" 
                label="Jelszó" 
                type={showPassword ? 'text' : 'password'} 
                variant='outlined' 
                margin='normal' 
                className='w-5/6 lg:w-4/6' 
                onChange={(e) => handleInputChange(e, setPassword)}
                error={(PasswordError !== "")}
                helperText={PasswordError} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><KeyOutlinedIcon /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }}/>
                <Button onClick={handleLogin} variant="outlined" className="!mt-8">Bejelentkezés</Button>
                <Button onClick={() => navigate("/login/register")}>Még nincs fiókja?</Button>
            </form>
        </React.Fragment>
    );
}