import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function ReportDashBoard()
{
    return (
        <div className='btncontainer'>
        <Link to="/studentmanagement"><Button className='btn'>Student Reports</Button></Link><br />
        <Link to="/professormanagement"><Button className='btn'>Professor Reports</Button></Link><br />
        <Link to="/coursemanagement"><Button className='btn'>Course Reports</Button></Link><br />
        <Link to="/courseenrollmanagement"><Button className='btn'>Course Enroll Reports</Button></Link><br />
        {/* <Link to="/reports"><Button className='btn'>Reports</Button></Link> */}
        </div>
    );
}

export default ReportDashBoard;