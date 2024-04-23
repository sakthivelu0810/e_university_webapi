import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const PendingStudents = () => {
  const [pendingstudents, setPendingStudents] = useState([]);
  const [suspendedstudents, setSuspendedStudents] = useState([]);
  const [approvedstudents, setApprovedStudents] = useState([]);
  const [rejectedstudents, setRejectedStudents] = useState([]);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://localhost:7178/api/Students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPendingStudents(data.filter(student => student.status === 'pending'));
      setApprovedStudents(data.filter(student => student.status === 'Approved'));
      setSuspendedStudents(data.filter(student => student.status === 'Suspended'));
      setRejectedStudents(data.filter(student => student.status === 'Rejected'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Students/${studentId}/UpdateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchPendingStudents(); // Refresh the list after approval
      window.location.reload();
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleReject = async (studentId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Students/${studentId}/UpdateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchPendingStudents(); // Refresh the list after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchPendingStudents(); // Refresh the list after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  const handleSuspend = async (studentId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Students/${studentId}/UpdateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Suspended' }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchPendingStudents(); // Refresh the list after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4">Pending Student Requests</Typography>
      <br />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingstudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(student.id)} variant="contained" color="success">
                  Approve
                </Button>
                <Button onClick={() => handleReject(student.id)} variant="contained" color="error">
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br /><br />
      <Typography variant="h4">Approve Students</Typography>
      <Table>
        <br />
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvedstudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>
                <Button onClick={() => handleSuspend(student.id)} variant="contained" color="success">
                  Suspend
                </Button>
                <Button onClick={() => handleDelete(student.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br /><br />
      <Typography variant="h4">Suspended Students</Typography>
        <br />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suspendedstudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(student.id)} variant="contained" color="success">
                  Reinstate
                </Button>
                <Button onClick={() => handleDelete(student.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br /><br />
      <Typography variant="h4">Rejected Students</Typography>
        <br />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rejectedstudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(student.id)} variant="contained" color="error">
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingStudents;
