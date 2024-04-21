import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router';

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
                case 'toLogin': {return;}
                case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                default: {return;}
            }
        })
    })

    return(
        <React.Fragment>
                <div className='flex w-full h-screen bg-gray-800 justify-center items-center'>
                    <div className='flex flex-col fixed w-5/6 h-5/6  lg:w-2/6 lg:h-4/6 bg-gray-400 shadow-2xl items-center justify-center'>
                        <Outlet />
                    </div>
                </div>
        </React.Fragment>
    );
}
