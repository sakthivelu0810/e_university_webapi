import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardMedia,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import axios from "axios";
import FrontImage from './back2.png';
import './App.css';

const HomePage = () => {
  const navigate = useNavigate();

  const [batchCourses, setBatchCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  useEffect(() => {
    fetchBatchCourses();
  }, []);

  const fetchBatchCourses = async () => {
    try {
      const batchesResponse = await fetch("https://localhost:7178/api/Batches");
      if (!batchesResponse.ok) {
        throw new Error("Failed to fetch batches");
      }
      const batches = await batchesResponse.json();

      const promises = batches.map(async (batch) => {
        try {
          const courseResponse = await fetch(
            `https://localhost:7178/api/CourseDetails/${batch.courseId}`
          );
          if (!courseResponse.ok) {
            throw new Error("Failed to fetch course details");
          }
          const courseDetails = await courseResponse.json();

          if (courseDetails && batch) {
            return {
              batchId: batch.batchId,
              professorName: courseDetails.professorName,
              courseName: courseDetails.courseName,
              fees: courseDetails.fees,
              startDate: formatDate(batch.startDate),
              endDate: formatDate(batch.endDate),
              courseId: courseDetails.courseId,
              professorId: courseDetails.professorId,
            };
          } else {
            console.error(
              "Unexpected data format for course details:",
              courseDetails
            );
            return null;
          }
        } catch (courseError) {
          console.error("Error fetching course details:", courseError);
          return null;
        }
      });

      const batchCoursesData = await Promise.all(promises);
      setBatchCourses(batchCoursesData.filter(Boolean)); // Remove null entries
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const fetchFilterBatch = async (batchId, courseId) => {
    const token = localStorage.getItem("token");

    const batchresponse = await axios.get(
      "https://localhost:7178/api/Batches",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const filteredBatch = batchresponse.data.filter(
      (batches) => batches.courseId === courseId && batches.batchId === batchId
    );

    if (filteredBatch.length === 1) {
      const startDate = filteredBatch[0].startDate.substring(0, 10);
      const endDate = filteredBatch[0].endDate.substring(0, 10);

      return { startDate, endDate };
    } else return null;
  };

  const handleEnrollNow = async (batch) => {
    const isStudent = localStorage.getItem("Role");
    const studentId = localStorage.getItem("Id");
    const token = localStorage.getItem("token");
    console.log(batch);

    if (!token || isStudent !== "student") {
      // User is not logged in, show dialog
      setIsDialogOpen(true);
      setSelectedBatch(batch);
    } else {
      setIsEnrollOpen(true);

      const dates = await fetchFilterBatch(batch.batchId, batch.courseId);

      // console.log("Dates",dates);
      // console.log(dates.startDate);
      // console.log(dates.endDate);

      const enrollresponse = await axios.get(
        "https://localhost:7178/api/CourseEnrollDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(batch.courseId);
      // console.log(batch.batchId);
      // console.log(studentId);

      // console.log(enrollresponse.data);

      const filterEnrolledCourses = enrollresponse.data.filter(
        (enrolls) =>
          enrolls.courseId === batch.courseId &&
          enrolls.batchId === batch.batchId &&
          enrolls.studentId === parseInt(studentId, 10) &&
          (enrolls.registrarStatus === "Approved" ||  enrolls.registrarStatus === "Pending")
      );

      console.log(filterEnrolledCourses);

      if (filterEnrolledCourses.length !== 0) {
        setNotificationMessage(
          "Enrollment failed! ~ Already Enrolled in the Course"
        );
        setNotificationSeverity("warning");
        setIsEnrollOpen(false);
        setNotificationOpen(true);
        // console.log("corse is here!");
        return;
      }

      // User is logged in, enroll
      // await enrollStudent(batch);
    }
  };

  const enrollStudent = async (batch) => {
    const studentId = localStorage.getItem("Id");
    const token = localStorage.getItem("token");
    const studentName = localStorage.getItem("Name");

    if (!studentId || !studentName) {
      console.error("Student ID or name not found in local storage.");
      return;
    }

    const courseEnrollDetails = {
      courseId: batch.courseId,
      batchId: batch.batchId,
      studentId: parseInt(studentId),
      studentName: studentName,
      professorId: batch.professorId,
      registrarStatus: "Pending",
      taskCompleted: 0,
      completionStatus: false,
    };

    try {
      const enrollResponse = await fetch(
        "https://localhost:7178/api/CourseEnrollDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(courseEnrollDetails),
        }
      );

      if (!enrollResponse.ok) {
        throw new Error("Failed to enroll student");
      }

      setNotificationMessage("Enrolled successfully!");
      setNotificationSeverity("success");
      setNotificationOpen(true);
    } catch (error) {
      console.error("Error enrolling student:", error);
      setNotificationMessage("Failed to enroll student. Please try again.");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  };

  const BatchCard = ({ batchCourse }) => {
    return (
      <Card variant="outlined" className="btncontainer">
        <CardContent>
          
          {/* <Typography variant="h5" component="div">
            Course ID: {batchCourse.courseId}
          </Typography>
          <Typography variant="h5" component="div">
            Prof ID: {batchCourse.professorId}
          </Typography> */}
          <Typography variant="h6">
            {batchCourse.courseName} by Prof.{batchCourse.professorName}
          </Typography>
          <hr />
          <Typography variant="h7" component="div">
            Batch ID: {batchCourse.batchId}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Professor Name: {batchCourse.professorName}
          </Typography> */}
          <Typography variant="body2" color="text.secondary">
            Fees : Rs.{batchCourse.fees}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start Date: {batchCourse.startDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            End Date: {batchCourse.endDate}
          </Typography>
          <Button
            onClick={() => handleEnrollNow(batchCourse)}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            className="btn"
          >
            Enroll Now
          </Button>
        </CardContent>
      </Card>
    );
  };

  const handleLoginClose = () => {
    setIsDialogOpen(false);
    setIsEnrollOpen(false);
  };

  const handleLogin = () => {
    // Redirect to login page or handle login action
    // For demonstration, just closing the dialog
    navigate("/login");
    setIsDialogOpen(false);
  };

  const handleEnroll = () => {
    navigate("/studentdashboard");
    setIsDialogOpen(false);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [upiId, setUpiId] = useState("");

  const handlePaymentOptionChange = (event) => {
    setSelectedPaymentOption(event.target.value);
  };

  const handleUpiIdChange = (event) => {
    setUpiId(event.target.value);
  };

  const handlePayNow = (batch) => {
    // Here you can use selectedPaymentOption and upiId for further processing
    // For now, we'll just log the selected values
    console.log("Selected Payment Option:", selectedPaymentOption);
    console.log("UPI ID:", upiId);
    enrollStudent(batch);

    // Close the dialog
    handleEnroll();
  };

  return (
    <>
     <Grid container spacing={2} className="grid" justifyContent="center" alignItems="center" style={{ width: '85vw' }}>
      {/* Left side for text */}
      <Grid item xs={12} sm={6} style={{ marginLeft: "-200px" }}>
        <br /><br />
        <Typography className="title" variant="h4" gutterBottom>
          KINSTON E-UNIVERSITY
        </Typography>
        <br />
        <br />
        <Typography variant="body1">
          Learn Anytime, Anywhere!
        </Typography>
        <br />
        <Link to="/login">
        <Button className="btn">Login now!</Button>
        </Link>
      </Grid>

      {/* Right side for image */}
      <Grid item xs={12} sm={6}>
        <img
          src={FrontImage}
          alt="Your Image Alt Text"
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
    </Grid>
    <Container maxWidth="md" style={{ marginTop: "100px" }}>
      <Typography className="title" variant="h5" gutterBottom>
          Courses Available Currently!
      </Typography>
      <br />
      <br />
      <br />
      <Grid container spacing={3}>
        {batchCourses.map((batchCourse) => (
          <Grid item xs={6} key={batchCourse.batchId}>
            <BatchCard batchCourse={batchCourse} />
            <Dialog open={isEnrollOpen} onClose={handleLoginClose}>
              <DialogTitle>Payment Options</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Choose a payment option and enter your UPI ID:
                </Typography>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="gpay"
                      checked={selectedPaymentOption === "gpay"}
                      onChange={handlePaymentOptionChange}
                    />
                    GPay
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="paytm"
                      checked={selectedPaymentOption === "paytm"}
                      onChange={handlePaymentOptionChange}
                    />
                    Paytm
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="phonepe"
                      checked={selectedPaymentOption === "phonepe"}
                      onChange={handlePaymentOptionChange}
                    />
                    PhonePe
                  </label>
                </div>
                <TextField
                  label="Enter UPI ID"
                  variant="outlined"
                  fullWidth
                  value={upiId}
                  onChange={handleUpiIdChange}
                  style={{ marginTop: "10px" }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handlePayNow(batchCourse)} color="primary">
                  Pay now
                </Button>
                <Button onClick={handleLoginClose} color="secondary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={handleLoginClose}>
        <DialogTitle>Please Login</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You need to login as student to enroll in the course.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
          <Button onClick={handleLoginClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </Container>
  </>
  );
};

export default HomePage;
