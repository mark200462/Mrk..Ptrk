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



export default function Register() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfPassword, setShowConfPassword] = React.useState(false);

    const [success, setSuccess] = React.useState(false)

    const [Email, setEmail] = React.useState("")
    const [Password, setPassword] = React.useState("")
    const [ConfPassword, setConfPassword] = React.useState("")

    const [EmailError, setEmailError] = React.useState("")
    const [PasswordError, setPasswordError] = React.useState("")
    const [ConfPasswordError, setConfPasswordError] = React.useState("")

    function clearError(){
        setEmailError("")
        setPasswordError("")
        setConfPasswordError("")
        setSuccess(false)
    }

    function handleInputChange(e,func){
        func(e.target.value)
        clearError()
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfPassword = () => setShowConfPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    function handleRegister() {
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
        if (isEmpty(ConfPassword)){
            setConfPasswordError("Ne hagyj üres mezőt!")
            error = true
        }
        
        if(error){
            return false
        }

        if(!new RegExp(".{8}").test(Password)){
            setPasswordError("A jelszavad minimum 8 karakter hosszúnak kell lennie!")
            setConfPasswordError("A jelszavad minimum 8 karakter hosszúnak kell lennie!")
            return false
        }
        if(!new RegExp("(?=.*[A-Z])").test(Password)){
            setPasswordError("A jelszavadban kell lennie minimum 1 nagy betűnek!")
            setConfPasswordError("A jelszavadban kell lennie minimum 1 nagy betűnek!")
            return false
        }
        if(!new RegExp("(?=.*[0-9])").test(Password)){
            setPasswordError("A jelszavadban kell lennie minimum 1 számnak!")
            setConfPasswordError("A jelszavadban kell lennie minimum 1 számnak!")
            return false
        }
        
        if(Password !== ConfPassword){
            setPasswordError("A két jelszó nem egyezik!")
            setConfPasswordError("A két jelszó nem egyezik!")
            return false
        }

        fetch('http://127.0.0.1:6969/api/v1/users/create/', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: Email,
                password: Password
            })
        }).then((response) => response.json()).then((data) => {
            switch(data.message){
                case "takenEmail": {setEmailError("Ez az email cím foglalt!"); break}
                case "Success": {setSuccess(true); break}
                default: break;
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
                color={(success ? "success" : "")}
                focused={success ? true : false}
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
                color={(success ? "success" : "")}
                focused={success}
                onChange={(e) => handleInputChange(e, setPassword)} 
                error={(PasswordError !== "")}
                helperText={PasswordError}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><KeyOutlinedIcon /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }}/>
                <TextField 
                id="ConfPassword" 
                label="Jelszó" 
                type={showConfPassword ? 'text' : 'password'} 
                variant='outlined' 
                margin='normal' 
                className='w-5/6 lg:w-4/6' 
                color={(success ? "success" : "")}
                focused={success}
                onChange={(e) => handleInputChange(e, setConfPassword)} 
                error={(ConfPasswordError !== "")}
                helperText={ConfPasswordError}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><KeyOutlinedIcon /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                        onClick={handleClickShowConfPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showConfPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }}/>
                <Button variant="outlined" className="!mt-8" onClick={handleRegister}>Regisztráció</Button>
                <Button onClick={() => navigate("/login/login")}>Már van fiókja?</Button>
            </form>
        </React.Fragment>
    );
}