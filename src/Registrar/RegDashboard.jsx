import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function RegistrarDashboard()
{
    return (
        <>
        <Link to="/studentmanagement"><Button>Student Management</Button></Link>
        <Link to="/professormanagement"><Button>Professor Management</Button></Link>
        <Link to="/coursemanagement"><Button>Course Management</Button></Link>
        <Link to="/courseenrollmanagement"><Button>Course Enroll Management</Button></Link>
        </>
    );
}

export default RegistrarDashboard;