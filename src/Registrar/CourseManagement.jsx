import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('https://localhost:7178/api/CourseDetails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setCourses(response.data.filter(course => course.registrarStatus === 'Pending'));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`https://localhost:7178/api/CourseDetails/${courseId}/UpdateStatus`, {
        status: 'Approved',
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        fetchPendingCourses(); // Refresh the list after approval
        // window.location.reload();
      window.location.reload();
      }
    } catch (error) {
      console.error('Error approving course:', error);
    }
  };

  const handleReject = async (courseId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`https://localhost:7178/api/CourseDetails/${courseId}/UpdateStatus`, {
        status: 'Rejected',
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        fetchPendingCourses(); // Refresh the list after rejection
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejecting course:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Prof Name</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Fees</TableCell>
            <TableCell>Duration (months)</TableCell>
            <TableCell>Lesson Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.professorName}</TableCell>
              <TableCell>{course.courseName}</TableCell>
              <TableCell>{course.courseDescription}</TableCell>
              <TableCell>Rs.{course.fees}</TableCell>
              <TableCell>{course.courseDuration}</TableCell>
              <TableCell>{course.lessonCount}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(course.courseId)} variant="contained" color="success">
                  Approve
                </Button>
                <Button onClick={() => handleReject(course.courseId)} variant="contained" color="error">
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseManagement;
