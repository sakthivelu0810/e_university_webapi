import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function RegistrarDashboard()
{
    return (
        <div className='btncontainer'>
        <Link to="/studentmanagement"><Button className='btn'>Student Management</Button></Link><br />
        <Link to="/professormanagement"><Button className='btn'>Professor Management</Button></Link><br />
        <Link to="/coursemanagement"><Button className='btn'>Course Management</Button></Link><br />
        <Link to="/courseenrollmanagement"><Button className='btn'>Course Enroll Management</Button></Link>
        </div>
    );
}

export default RegistrarDashboard;