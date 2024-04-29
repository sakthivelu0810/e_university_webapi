import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';

const CourseForm = () => {
  const [courseDetails, setCourseDetails] = useState({
    ProfessorId: localStorage.getItem('Id'),
    ProfessorName: localStorage.getItem('Name'),
    courseName: '',
    courseDescription: '',
    fees: '',
    courseDuration: '',
    lessonCount: '',
    professorStatus: 'Active', 
    registrarStatus: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails({
      ...courseDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      console.log(courseDetails);

      const response = await fetch('https://localhost:7178/api/CourseDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to add course details');
      }

      // Clear form fields after successful submission
      setCourseDetails({
        ProfessorId: '',
        ProfessorName: '',
        courseName: '',
        courseDescription: '',
        fees: '',
        courseDuration: '',
        lessonCount: '',
        professorStatus: 'Active',
        registrarStatus: 'Pending',
      });

      alert('Course details added successfully!');
    } catch (error) {
      console.error('Error adding course details:', error);
      alert('Error adding course details');
    }
  };

  return (
    <Grid className='btncontainer' container justifyContent="center">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography className='title' variant="h5" gutterBottom>
            Add Course Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Course Name"
              name="courseName"
              value={courseDetails.courseName}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Course Description"
              name="courseDescription"
              value={courseDetails.courseDescription}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Fees"
              name="fees"
              type="number"
              value={courseDetails.fees}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Course Duration (in months)"
              name="courseDuration"
              type="number"
              value={courseDetails.courseDuration}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Lesson Count"
              name="lessonCount"
              type="number"
              value={courseDetails.lessonCount}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button className='btn' type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              Add Course
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CourseForm;
