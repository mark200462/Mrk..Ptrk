import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Panel from './Login/Panel';
import Login from './Login/Login';
import Register from './Login/Register';

import Dashboard from './Dashboard/Dashboard';
import Tasks from './Dashboard/Tasks/Tasks';
import Permissions from './Dashboard/Permissions/Permissions';
import Notifications from './Dashboard/Notifications/Notifications';
import Calendar from './Dashboard/Calendar/Calendar';

import NoPage from './NoPage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="login" element={<Panel />}>
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path='dashboard' element={<Dashboard />}>
          <Route path="notifications" element={<Notifications />}/>
          <Route path="calendar" element={<Calendar />}/>
          <Route path="tasks" element={<Tasks />}/>
          <Route path="permissions" element={<Permissions />}/>
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
);
