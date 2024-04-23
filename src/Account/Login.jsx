// components/Signin.js
import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Signin() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSuccess = (userData) => {
    const { token, id, name, role } = userData;

    // Store token and user details in local storage
    localStorage.setItem('token', token);
    localStorage.setItem('Id', id);
    localStorage.setItem('Name', name);
    localStorage.setItem('Role', role);

    // Navigate user to appropriate dashboard based on role
    if (role === "student") {
      navigate("/studentdashboard");
    } else if (role === "professor") {
      navigate("/professordashboard");
    } else {
      navigate("/registrardashboard");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://localhost:7178/api/Auth/Login', null, {
        params: {
          email: email,
          password: password
        }
      });
    //   const response = await axios.post('https://localhost:7283/api/Students/Login', {
    //     email,
    //     password,
    //   });
      // const token = response.data.token;
      // localStorage.setItem('token',token);
      // localStorage.setItem('Id',response.data.id);
      // localStorage.setItem('Name',response.data.name);
      // localStorage.setItem('Role',response.data.role);
      
      // if(response.data.role == "student") navigate("/homepage");
      // else if(response.data.role == "professor") navigate("/professordashboard");
      // else navigate("/registrardashboard");
      handleLoginSuccess(response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>Signin Page</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>Sign In</Button>
      </form>
      <Typography>Don't have an Account! <br></br> <Link to="/signupstudent">Signup as Student! </Link>  or  <Link to="/signupprof"> Signup as Professor!</Link></Typography>
    </Box>
  );
}

export default Signin;
