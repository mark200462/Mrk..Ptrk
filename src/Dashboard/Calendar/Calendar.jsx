import React, { useCallback, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { utc } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Divider from '@mui/material/Divider';
dayjs.extend(utc);


export default function Calendar(){
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [date, setDate] = useState(dayjs().local())
    
    const getTasks = useCallback((e) =>{
        fetch('http://127.0.0.1:6969/api/v1/task/getOwnDay', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    Time: dayjs(e).local().format("YYYY-MM-DD"),
                })
            }).then((response) => response.json()).then((data) => {
                switch(data.message){
                    case 'toLogin': {navigate("/login/login"); return;}
                    case 'toDashboard': {navigate("/dashboard/notifications"); return;}
                    case 'Success': {setNotifications(data.payload.Tasks); return;}
                    default: {return;}
                }

        })
    }, [navigate])

    useEffect(() => {
        getTasks(date)
    }, [date,setNotifications,navigate,getTasks])

    
    return(
        <div className='w-full flex flex-col lg:flex-row'>
            <div className='sticky lg:relative'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar value={date} timezone='UTC' onChange={(e) => {setDate(dayjs(e).local()); getTasks(e)}}/>
                </LocalizationProvider>
            </div>

            <Divider className='bg-gray-800 hidden lg:block' orientation="vertical" flexItem/>
            <div className='w-full'>
                {notifications.map((row, index) => (
                    <div className=' mx-4 w-full h-16' key={row.ID}>
                        <div className='flex w-full h-full items-center'>
                            <div className='bg-[#4fc3f7] mr-4 p-1 rounded-lg'>
                                {dayjs(row.Time).utc().format("HH:mm")}
                            </div>
                            {row.Name}
                            
                        </div>
                        <Divider />
                    </div>         
                ))}
            </div>
        </div>
    )
}