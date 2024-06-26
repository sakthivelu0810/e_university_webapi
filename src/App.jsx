import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Login from "./Account/Login";
import SignUpStudent from "./Account/SignUp_Student";
import SignUpProf from "./Account/SignUp_Prof";
import RegistratDashBoard from "./Registrar/RegDashboard";
import ProfDashBoard from "./Professor/ProfessorDashboard";
import StudentManagement from "./Registrar/StudentManagement";
import ProfManagement from "./Registrar/ProfessorManagement";
import CourseManagement from "./Registrar/CourseManagement";
import CreateCourse from "./Professor/CreateCourse";
import UpdateCourseForm from "./Professor/UpdateCourseForm";
import CreateBatch from "./Professor/CreateBatch";
import HomePage from "./HomePage";
import CreateLesson from "./Professor/CreateLesson";
import CourseEnrollManagement from "./Registrar/CourseEnrollManagement";
import StudentDashboard from "./Student/StudentDashboard";
import CourseDetailPage from "./Student/CourseDetailPage";
import ReportDashBoard from "./Report/ReportDashboard";
import Logo from "./navicon.png";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isProf, setIsProf] = useState(false);
  const [isRegistrar, setIsRegistrar] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [anchormenu, setAnchorMenu] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in
      const name = localStorage.getItem("Name");
      setUserName(name);
      const role = localStorage.getItem("Role");
      if (role === "student") {
        setIsStudent(true);
      } else if (role === "professor") {
        setIsProf(true);
      } else {
        setIsRegistrar(true);
      }
      setIsLoggedIn(true);
    } else {
      // User is not logged in
      setIsLoggedIn(false);
      setUserName("");
      setIsStudent(false);
      setIsProf(false);
      setIsRegistrar(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    const { name, role } = userData;

    // Store token and user details in local storage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("Id", userData.id);
    localStorage.setItem("Name", name);
    localStorage.setItem("Role", role);

    // Update state
    setUserName(name);
    if (role === "student") {
      setIsStudent(true);
    } else if (role === "professor") {
      setIsProf(true);
    } else {
      setIsRegistrar(true);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear token and user info from local storage
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setIsStudent(false);
    setIsProf(false);
    setIsRegistrar(false);
    navigate("/homepage");
  };

  const handleProfile = () => {};

  const handleMenuOpen = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorMenu(null);
  };

  return (
    <div className="app">
      <AppBar className="navbar" position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link className="link" to="/homepage">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
            </Link>
          </IconButton>
          {isStudent && (
            <Typography>
              <Link className="link" to="/studentdashboard">
                My DashBoard
              </Link>
            </Typography>
          )}
          {isProf && (
            <Typography>
              <Link className="link" to="/professordashboard">
                Professor DashBoard
              </Link>
            </Typography>
          )}
          {isRegistrar && (
            <Typography>
              <Link className="link" to="/registrardashboard">
                Registrar DashBoard
              </Link>
            </Typography>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          {isLoggedIn ? (
            <React.Fragment>
              <Button
                color="inherit"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                startIcon={<AccountCircleIcon />}
              >
                Hi, {userName}
              </Button>
              <Menu
                id="user-menu"
                anchormenu={anchormenu}
                open={Boolean(anchormenu)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                anchorPosition={{ top: "10%", right: "10%" }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            // <Box display="flex" alignItems="center">
            //   <React.Fragment>
            //     <Button
            //       color="inherit"
            //       aria-controls="user-menu"
            //       aria-haspopup="true"
            //       onClick={handleMenuOpen}
            //       startIcon={<AccountCircleIcon />}
            //     >
            //       Hi, {userName}
            //     </Button>
            //     <Menu
            //       id="user-menu"
            //       anchormenu={anchormenu}
            //       open={Boolean(anchormenu)}
            //       onClose={handleMenuClose}
            //       anchorOrigin={{
            //         vertical: "bottom",
            //         horizontal: "center",
            //       }}
            //       transformOrigin={{
            //         vertical: "top",
            //         horizontal: "center",
            //       }}
            //     >
            //       <MenuItem onClick={handleLogout}>Logout</MenuItem>
            //     </Menu>
            //   </React.Fragment>

            //   <Typography variant="body1" color="inherit" sx={{ mr: 3 }}>
            //     {/* <AccountCircleIcon sx={{ mr: 1 }} />  */}
            //     Hi, {userName}
            //   </Typography>
            //   <Button color="inherit" onClick={handleLogout}>
            //     Logout
            //   </Button>
            // </Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="content">
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/signupstudent" element={<SignUpStudent />} />
          <Route path="/signupprof" element={<SignUpProf />} />
          <Route path="/registrardashboard" element={<RegistratDashBoard />} />
          <Route path="/professorDashboard" element={<ProfDashBoard />} />
          <Route path="/studentmanagement" element={<StudentManagement />} />
          <Route path="/professormanagement" element={<ProfManagement />} />
          <Route path="/coursemanagement" element={<CourseManagement />} />
          <Route path="/createcourse" element={<CreateCourse />} />
          <Route
            path="/updatecourseform/:courseId"
            element={<UpdateCourseForm />}
          />
          <Route path="/createbatch" element={<CreateBatch />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route
            path="/createlessons/:courseId/:lessonCount"
            element={<CreateLesson />}
          />
          <Route
            path="/courseenrollmanagement"
            element={<CourseEnrollManagement />}
          />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          <Route path="/reportdashboard" element={<ReportDashBoard />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Container>

      {/* <footer className="footer">
        <Typography variant="body2" color="textSecondary" align="center">
          Footer Content
        </Typography>
      </footer> */}
    </div>
  );
}

export default App;
