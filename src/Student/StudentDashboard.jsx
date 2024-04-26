import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
} from '@mui/material';
import { Link, useNavigate } from "react-router-dom";


function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const studentId = localStorage.getItem('Id'); // Get student ID from local storage

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7178/api/CourseEnrollDetails/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pendingCourses = response.data.filter(course => course.registrarStatus === 'Approved');
        
        // Fetch additional details for each enrolled course
        const coursesWithDetails = await Promise.all(pendingCourses.map(async (course) => {
          const courseDetailsResponse = await axios.get(`https://localhost:7178/api/CourseDetails/ByCourseId/${course.courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const lessonsResponse = await axios.get(`https://localhost:7178/api/Lessons/ByCourseId/${course.courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const batchResponse = await axios.get(`https://localhost:7178/api/Batches/${course.batchId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const startDate = new Date(batchResponse.data.startDate).toLocaleDateString();
          const endDate = new Date(batchResponse.data.endDate).toLocaleDateString();

          return {
            ...course,
            courseName: courseDetailsResponse.data.courseName,
            courseDescription: courseDetailsResponse.data.courseDescription,
            professorName: courseDetailsResponse.data.professorName,
            courseDuration: courseDetailsResponse.data.courseDuration,
            StartDate: startDate,
            EndDate: endDate,
            lessons: lessonsResponse.data,
          };
        }));

        setEnrolledCourses(coursesWithDetails);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, [studentId]); // Fetch courses when studentId changes

  return (
    <Container className='btncontainer' maxWidth="md" style={{ marginTop: 20 }}>
      <Typography className='title' variant="h4" gutterBottom>
        Enrolled Courses
      </Typography>
      <br /><br />
      <Grid container spacing={3}>
        {enrolledCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.enrollId}>
            <Card>
              <CardHeader
                title={course.courseName}
                subheader={`~ By ${course.professorName}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lessons: {course.courseDuration} months
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Start date : {course.StartDate} 
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  End date : {course.EndDate} 
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Description : {course.courseDescription}
                </Typography>
                <Link to={`/course/${course.courseId}?batchId=${course.batchId}`}>
                  <Button className='btn' variant="contained" color="primary" style={{ marginTop: 10 }}>
                    Go to Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default StudentDashboard;
