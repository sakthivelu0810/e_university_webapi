import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PendingProfessors = () => {
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    fetchPendingProfessors();
  }, []);

  const fetchPendingProfessors = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://localhost:7178/api/Professors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProfessors(data.filter(professor => professor.status === 'Pending'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleApprove = async (professorId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Professors/${professorId}/UpdateStatus`, {
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

      fetchPendingProfessors(); // Refresh the list after approval
      window.location.reload();
    } catch (error) {
      console.error('Error approving professor:', error);
    }
  };

  const handleReject = async (professorId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Professors/${professorId}/UpdateStatus`, {
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

      fetchPendingProfessors(); // Refresh the list after rejection
    } catch (error) {
      console.error('Error rejecting professor:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Qualification</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {professors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell>{professor.name}</TableCell>
              <TableCell>{professor.email}</TableCell>
              <TableCell>{professor.specialization}</TableCell>
              <TableCell>{professor.qualification}</TableCell>
              <TableCell>{professor.phoneNumber}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(professor.id)} variant="contained" color="success">
                  Approve
                </Button>
                <Button onClick={() => handleReject(professor.id)} variant="contained" color="error">
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

export default PendingProfessors;
