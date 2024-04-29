import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function ProfDashBoard() {
  const [courseData, setCourseData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const profId = localStorage.getItem('Id');
      const profIdNum = parseInt(profId);
      const response = await axios.get('https://localhost:7178/api/CourseDetails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(profId);
      
      if (response.data) {
        const courses = response.data.filter(course => course.registrarStatus === 'Approved' && course.professorId === profIdNum);
        const coursesWithBatches = await Promise.all(courses.map(course => fetchCourseBatches(course)));
        setCourseData(coursesWithBatches);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseBatches = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7178/api/Batches/Course/${course.courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        return {
          ...course,
          batches: response.data,
        };
      }
    } catch (error) {
      console.error('Error fetching batches for course:', error);
      return course;
    }
  };

  const handleUpdateCourse = (courseId) => {
    navigate(`/updatecourseform/${courseId}`);
  };

  const handleCreateLesson = (courseId, lessonCount) => {
    navigate(`/createlessons/${courseId}/${lessonCount}`);
  }

  const handleCreateBatch = (courseId, courseDuration) => {
    localStorage.setItem('courseId', courseId);
    localStorage.setItem('courseDuration', courseDuration);
    navigate('/createbatch');
  };

  const CourseCard = ({ course }) => {
    return (
      <Grid className='btncontainer' item xs={12} sm={6}>
        <Card variant="outlined" style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {course.courseName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description: {course.courseDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fees: Rs.{course.fees}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {course.courseDuration} months
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lesson Count: {course.lessonCount}
            </Typography>
            <Button
              className='btn'
              onClick={() => handleUpdateCourse(course.courseId)}
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}>
              Update Course
            </Button>
            <Button
              className='btn'
              onClick={() => handleCreateLesson(course.courseId, course.lessonCount)}
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}>
              Create Lessons
            </Button>
            <br />
            <hr />
            <Typography variant="h5" style={{ marginTop: 20 }}>Batches</Typography><br />
            {course.batches && course.batches.length > 0 ? (
              course.batches.map(batch => (
                <div key={batch.batchId}>
                  <Typography variant="body2">
                    Batch ID: {batch.batchId}
                  </Typography>
                  <Typography variant="body2">
                    Start Date: {batch.startDate}
                  </Typography>
                  <Typography variant="body2">
                    End Date: {batch.endDate}
                  </Typography>
                  {/* Add more batch details here as needed */}
                </div>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No batches currently available.
              </Typography>
            )}
            <Button 
              className='btn'
              onClick={() => handleCreateBatch(course.courseId, course.courseDuration)}
              variant="contained" color="primary" style={{ marginTop: 10 }}>
              Create Batch
            </Button>
            <br /><hr />
          </CardContent>
        </Card>
      </Grid>
    );
  };
  

  return (
    <Container className='btncontainer' maxWidth="md" style={{ marginTop: 20 }}>
      <Link to="/createcourse">
        <Button className='btn' variant="contained" color="primary" style={{ marginBottom: 20 }}>
          Create Course
        </Button>
      </Link>
      <br /><br />
      <Typography className='title' variant="h4" gutterBottom>
        My Courses
      </Typography>
      <br /><br />
      <Grid container spacing={3}>
        {courseData.map((course) => (
          <CourseCard key={course.courseId} course={course} />
        ))}
      </Grid>
    </Container>
  );
}

export default ProfDashBoard;
