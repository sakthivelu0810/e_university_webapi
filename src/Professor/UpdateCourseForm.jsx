import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Container, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Notification from '../Notification';

const UpdateCourseForm = ({ onClose }) => {

  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState({
    courseName: '',
    courseDescription: '',
    fees: '',
    courseDuration: '',
    lessonCount: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`https://localhost:7178/api/CourseDetails/${courseId}`);
      if (response.data) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `https://localhost:7178/api/CourseDetails/${courseId}`,
        {
          ...course,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setNotification({
          open: true,
          message: 'Course details updated successfully!',
          severity: 'success',
        });
        // Call onClose to close the form after successful update
        onClose();
      }
      navigate('/professordashboard');
      
    } catch (error) {
      console.error('Error updating course:', error);
      setNotification({
        open: true,
        message: 'An error occurred while updating course details.',
        severity: 'error',
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container className='btncontainer' maxWidth="sm" style={{ marginTop: 20 }}>
      <Typography className='title' variant="h4" gutterBottom>
        Update Course
      </Typography>
      <TextField
        name="courseName"
        label="Course Name"
        variant="outlined"
        fullWidth
        value={course.courseName}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <TextField
        name="courseDescription"
        label="Course Description"
        variant="outlined"
        fullWidth
        value={course.courseDescription}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <TextField
        name="fees"
        label="Fees"
        variant="outlined"
        fullWidth
        value={course.fees}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <TextField
        name="courseDuration"
        label="Course Duration"
        variant="outlined"
        fullWidth
        value={course.courseDuration}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <TextField
        name="lessonCount"
        label="Lesson Count"
        variant="outlined"
        fullWidth
        value={course.lessonCount}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <Button className='btn' onClick={handleUpdate} variant="contained" color="primary">
        Update Course
      </Button>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Container>
  );
};

export default UpdateCourseForm;
