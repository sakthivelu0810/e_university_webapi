import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';

function PendingEnrollments() {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  useEffect(() => {
    const fetchPendingEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7178/api/CourseEnrollDetails/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setPendingEnrollments(response.data);
      } catch (error) {
        console.error('Error fetching pending enrollments:', error);
      }
    };

    fetchPendingEnrollments();
  }, []);

  const handleApprove = async (enrollmentId, courseId, batchId) => {
    try {
      const token = localStorage.getItem('token');
      // console.log(enrollmentId);
      const response = await axios.put(`https://localhost:7178/api/CourseEnrollDetails/${enrollmentId}/approve`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the status in the UI after successful approval
      setPendingEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment.id === enrollmentId ? { ...enrollment, registrarStatus: 'Pending' } : enrollment
        )
      );

    // Fetch all lessons based on the courseId
    const lessonResponse = await axios.get(`https://localhost:7178/api/Lessons/ByCourseId/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get the array of lessons
    const lessons = lessonResponse.data;

    // Create an array of StudentLesson objects with status as 'Not Completed'
    const studentLessons = lessons.map((lesson) => ({
      studentId: localStorage.getItem('Id'), // Assuming studentId is retrieved from local storage
      lessonId: lesson.lessonId,
      lessonTitle: lesson.lessonTitle,
      lessonContent: lesson.lessonContent,
      lessonNumber: lesson.lessonNumber,
      courseId: courseId,
      batchId: batchId,
      status: 'Not Completed', // Marking each lesson as 'Not Completed'
    }));

    console.log(studentLessons);

    studentLessons.map((student) => {
      axios.post('https://localhost:7178/api/StudentLessons', student, {
        headers: {
              Authorization: `Bearer ${token}`,
            },
      })
    });

    console.log("Approved successfully");
    window.location.reload();

    } catch (error) {
      console.error('Error approving enrollment:', error);
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://localhost:7178/api/CourseEnrollDetails/${enrollmentId}/reject`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the status in the UI after successful rejection
      setPendingEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment.id === enrollmentId ? { ...enrollment, registrarStatus: 'Rejected' } : enrollment
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        Pending Enrollments
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Id</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Prof Id</TableCell>
              <TableCell>Batch Id</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingEnrollments.map((enrollment) => (
              <TableRow key={enrollment.enrollId}>
                <TableCell>{enrollment.courseId}</TableCell>
                <TableCell>{enrollment.studentName}</TableCell>
                <TableCell>{enrollment.professorId}</TableCell>
                <TableCell>{enrollment.batchId}</TableCell>
                <TableCell>{enrollment.registrarStatus}</TableCell>
                <TableCell>
                  {enrollment.registrarStatus === 'Approved' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(enrollment.enrollId, enrollment.courseId, enrollment.batchId)}
                        style={{ marginRight: 10 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleReject(enrollment.enrollId)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PendingEnrollments;
