import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom"

export default function Panel(){
    const navigate = useNavigate()
    
    useEffect(() => {
        fetch('http://127.0.0.1:6969/api/v1/users/validate', {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    default: {return;}
                }

        })
    })

    return(<React.Fragment></React.Fragment>);
}
