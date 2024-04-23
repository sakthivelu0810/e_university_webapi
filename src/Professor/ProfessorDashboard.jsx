// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button, Typography, Container, Grid, Card, CardContent } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';

// function ProfDashBoard() {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('https://localhost:7178/api/CourseDetails', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });    
//       if (response.data) {
//         const approvedCourses = response.data.filter(course => course.registrarStatus === 'Approved');
//         setCourses(approvedCourses);
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   const handleUpdateCourse = (courseId) => {
//     navigate("/updatecourseform");
//     setSelectedCourseId(courseId);
//   };

//   const handleCloseUpdateForm = () => {
//     setSelectedCourseId(null);
//     fetchCourses(); // Refresh courses after update
//   };

//   const handleCreateBatch = (courseId, courseDuration) => {
//     localStorage.setItem('courseId', courseId);
//     localStorage.setItem('courseDuration', courseDuration);
//     navigate('/createbatch');
//   }


//   const CourseCard = ({ course }) => {
//     return (
//       <Grid item xs={12} sm={6} md={4}>
//         <Card variant="outlined" style={{ marginBottom: 20 }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom>
//               {course.courseName}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Description: {course.courseDescription}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Fees: Rs.{course.fees}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Duration: {course.courseDuration} months
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Lesson Count: {course.lessonCount}
//             </Typography>
//             <Button 
//               onClick={() => handleCreateBatch(course.courseId, course.courseDuration)}
//               variant="contained" color="primary" style={{ marginTop: 10 }}>
//               Create Batch
//             </Button>
//             <Button
//               onClick={() => handleUpdateCourse(course.courseId)}
//               variant="contained"
//               color="primary"
//               style={{ marginTop: 10 }}
//             >
//               Update Course
//             </Button>
//             </CardContent>
//         </Card>
//       </Grid>
//     );
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: 20 }}>
//       <Link to="/createcourse">
//         <Button variant="contained" color="primary" style={{ marginBottom: 20 }}>
//           Create Course
//         </Button>
//       </Link>
//       <Typography variant="h4" gutterBottom>
//         My Courses
//       </Typography>
//       <Grid container spacing={3}>
//         {courses.map((course) => (
//           <CourseCard key={course.courseId} course={course} />
//         ))}
//       </Grid>
//     </Container>
//   );
// }

// export default ProfDashBoard;

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
      const response = await axios.get('https://localhost:7178/api/CourseDetails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        const courses = response.data.filter(course => course.registrarStatus === 'Approved');
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
      <Grid item xs={12} sm={6} md={4}>
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
              onClick={() => handleCreateBatch(course.courseId, course.courseDuration)}
              variant="contained" color="primary" style={{ marginTop: 10 }}>
              Create Batch
            </Button>
            <Button
              onClick={() => handleUpdateCourse(course.courseId)}
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}>
              Update Course
            </Button>
            <Button
              onClick={() => handleCreateLesson(course.courseId, course.lessonCount)}
              variant="contained"
              color="primary"
              style={{ marginTop: 10 }}>
              Create Lessons
            </Button>
            <Typography variant="h6" style={{ marginTop: 20 }}>Batches</Typography>
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
          </CardContent>
        </Card>
      </Grid>
    );
  };
  

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Link to="/createcourse">
        <Button variant="contained" color="primary" style={{ marginBottom: 20 }}>
          Create Course
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courseData.map((course) => (
          <CourseCard key={course.courseId} course={course} />
        ))}
      </Grid>
    </Container>
  );
}

export default ProfDashBoard;
