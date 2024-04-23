import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";

function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://localhost:7178/api/CourseDetails/ByCourseId/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourse(response.data);

        // Fetch lessons for the course
        const lessonsResponse = await axios.get(
          `https://localhost:7178/api/Lessons/ByCourseId/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Sort lessons by lessonNumber in ascending order
        const sortedLessons = lessonsResponse.data.sort(
          (a, b) => a.lessonNumber - b.lessonNumber
        );
        setLessons(sortedLessons);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleCheckboxChange = async (lessonId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      // Send a PUT request to update the lesson status
      await axios.put(
        `https://localhost:7178/api/StudentLessons/${lessonId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update the local state with the new completion status
      setCourse((prevCourse) => ({
        ...prevCourse,
        lessons: prevCourse.lessons.map((lesson) =>
          lesson.lessonId === lessonId ? { ...lesson, status: newStatus } : lesson
        ),
      }));
    } catch (error) {
      console.error('Error updating lesson status:', error);
    }
  };
  

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      {course && (
        <>
          <Typography variant="h4" gutterBottom>
            {course.courseName}
          </Typography>
          <Card>
            <CardHeader title={`By ${course.professorName}`} />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Lessons: {course.courseDuration} months
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Description: {course.courseDescription}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Lessons
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lesson Number</TableCell>
                      <TableCell>Lesson Title</TableCell>
                      <TableCell>Lesson Content</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.lessonId}>
                        <TableCell>{lesson.lessonNumber}</TableCell>
                        <TableCell>{lesson.lessonTitle}</TableCell>
                        <TableCell>{lesson.lessonContent}</TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={lesson.status === "Completed"}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    lesson.lessonId,
                                    e.target.checked
                                      ? "Completed"
                                      : "Not Completed"
                                  )
                                }
                              />
                            }
                            label={lesson.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}

export default CourseDetailPage;
