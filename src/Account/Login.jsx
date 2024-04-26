// components/Signin.js
import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FrontImage from '/back2.png';
import Icon from '../navicon.png';

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = (userData) => {
    const { token, id, name, role, status } = userData;

    // Store token and user details in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("Id", id);
    localStorage.setItem("Name", name);
    localStorage.setItem("Role", role);

    if (status !== "Approved" && status !== "Admin") {
      navigate("/login");
    } else if (role === "student") {
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
      const response = await axios.post(
        "https://localhost:7178/api/Auth/Login",
        null,
        {
          params: {
            email: email,
            password: password,
          },
        }
      );

      handleLoginSuccess(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
      className="btncontainer"
    >
      {" "}
      <Box sx={{ maxWidth: 400, textAlign: "center" }}>
        <Typography className="title" variant="h4" gutterBottom>
          Login
        </Typography>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            className="btn"
          >
            Login
          </Button>
        </form>
        <br />
        <Typography>
          Don't have an Account! <br /> <br />
          <Link to="/signupstudent">Signup as Student! </Link> or{" "}
          <Link to="/signupprof"> Signup as Professor!</Link>
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: "center" }}>
        <img
          src={Icon}
          alt="Front Image"
          style={{ maxWidth: "100%", height: "auto", marginLeft: "100px" }}
        />
      </Box>
    </Box>
  );
}

export default Signin;
