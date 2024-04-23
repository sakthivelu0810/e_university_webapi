import React, { useState, useEffect } from 'react';
import { Grid, Container, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Notification from './Notification';

const HomePage = () => {
  const navigate = useNavigate();

  const [batchCourses, setBatchCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');

  useEffect(() => {
    fetchBatchCourses();
  }, []);

  const fetchBatchCourses = async () => {
    try {
      const batchesResponse = await fetch('https://localhost:7178/api/Batches');
      if (!batchesResponse.ok) {
        throw new Error('Failed to fetch batches');
      }
      const batches = await batchesResponse.json();

      const promises = batches.map(async (batch) => {
        try {
          const courseResponse = await fetch(`https://localhost:7178/api/CourseDetails/${batch.courseId}`);
          if (!courseResponse.ok) {
            throw new Error('Failed to fetch course details');
          }
          const courseDetails = await courseResponse.json();

          if (
            courseDetails &&
            batch
          ) {
            return {
              batchId: batch.batchId,
              professorName: courseDetails.professorName,
              courseName: courseDetails.courseName,
              fees: courseDetails.fees,
              startDate: formatDate(batch.startDate),
              endDate: formatDate(batch.endDate),
              courseId: courseDetails.courseId,
              professorId: courseDetails.professorId
            };
          } else {
            console.error('Unexpected data format for course details:', courseDetails);
            return null;
          }
        } catch (courseError) {
          console.error('Error fetching course details:', courseError);
          return null;
        }
      });

      const batchCoursesData = await Promise.all(promises);
      setBatchCourses(batchCoursesData.filter(Boolean)); // Remove null entries
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleEnrollNow = async (batch) => {
    const isLoggedIn = localStorage.getItem('token');
    const isStudent = localStorage.getItem('Role');
    console.log("here0");

    if (!isLoggedIn || isStudent !== "student") {
      // User is not logged in, show dialog
      setIsDialogOpen(true);
      console.log("here");
      setSelectedBatch(batch);
    } else {
      // User is logged in, enroll
      await enrollStudent(batch);
    }
  };

  const enrollStudent = async (batch) => {
    const studentId = localStorage.getItem('Id');
    const studentName = localStorage.getItem('Name');

    if (!studentId || !studentName) {
      console.error('Student ID or name not found in local storage.');
      return;
    }

    const courseEnrollDetails = {
      courseId: batch.courseId,
      batchId: batch.batchId,
      studentId: parseInt(studentId),
      studentName: studentName,
      professorId: batch.professorId,
      registrarStatus: 'Pending',
      taskCompleted: 0,
      completionStatus: false
    };

    try {
      const token = localStorage.getItem('token');
      const enrollResponse = await fetch('https://localhost:7178/api/CourseEnrollDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseEnrollDetails)
      });

      if (!enrollResponse.ok) {
        throw new Error('Failed to enroll student');
      }

      setNotificationMessage('Enrolled successfully!');
      setNotificationSeverity('success');
      setNotificationOpen(true);
    } catch (error) {
      console.error('Error enrolling student:', error);
      setNotificationMessage('Failed to enroll student. Please try again.');
      setNotificationSeverity('error');
      setNotificationOpen(true);
    }
  };

  const BatchCard = ({ batchCourse }) => {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            Batch ID: {batchCourse.batchId}
          </Typography>
          <Typography variant="h5" component="div">
            Course ID: {batchCourse.courseId}
          </Typography>
          <Typography variant="h5" component="div">
            Prof ID: {batchCourse.professorId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Professor Name: {batchCourse.professorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Course Name: {batchCourse.courseName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fees : Rs.{batchCourse.fees}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start Date: {batchCourse.startDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            End Date: {batchCourse.endDate}
          </Typography>
          <Button onClick={() => handleEnrollNow(batchCourse)} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Enroll Now
          </Button>
        </CardContent>
      </Card>
    );
  };

  const handleLoginClose = () => {
    setIsDialogOpen(false);
  };

  const handleLogin = () => {
    // Redirect to login page or handle login action
    // For demonstration, just closing the dialog
    navigate("/login");
    setIsDialogOpen(false);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        {batchCourses.map((batchCourse) => (
          <Grid item xs={12} key={batchCourse.batchId}>
            <BatchCard batchCourse={batchCourse} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={handleLoginClose}>
        <DialogTitle>Please Login</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You need to login to enroll in the course.
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
  );
};

export default HomePage;
