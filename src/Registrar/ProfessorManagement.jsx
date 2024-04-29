import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PendingProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [approvedprofessors, setApprovedProfessors] = useState([]);
  const [suspendedprofessors, setSuspendedProfessors] = useState([]);
  const [rejectedprofessors, setRejectedProfessors] = useState([]);

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
      setApprovedProfessors(data.filter(professor => professor.status === 'Approved'));
      setRejectedProfessors(data.filter(professor => professor.status === 'Rejected'));
      setSuspendedProfessors(data.filter(professor => professor.status === 'Suspended'));
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
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting professor:', error);
    }
  };

  const handleSuspend = async (professorId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Professors/${professorId}/UpdateStatus`, {
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

      fetchPendingProfessors(); // Refresh the list after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting professor:', error);
    }
  };

  const handleDelete = async (professorId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7178/api/Professors/${professorId}/UpdateStatus`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchPendingProfessors(); // Refresh the list after rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting professor:', error);
    }
  };

  const downloadPDF = async (tableId, fileName) => {
    try {
      const table = document.getElementById(tableId);
      const canvas = await html2canvas(table);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4">Pending Professor Requests</Typography>
      <br />
      <Table id="pending-table">
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
      <br />
      <Button className='btn'  color="secondary" onClick={() => downloadPDF('pending-table', 'Pending_Professors')} variant="contained">Download Pending Professors PDF</Button>
      <br />
      <br />
      <Typography variant="h4">Approved Professors</Typography>
      <br />
      <Table id="approved-table">
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
          {approvedprofessors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell>{professor.name}</TableCell>
              <TableCell>{professor.email}</TableCell>
              <TableCell>{professor.specialization}</TableCell>
              <TableCell>{professor.qualification}</TableCell>
              <TableCell>{professor.phoneNumber}</TableCell>
              <TableCell>
                <Button onClick={() => handleSuspend(professor.id)} variant="contained" color="success">
                  Suspend
                </Button>
                <Button onClick={() => handleDelete(professor.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <Button className='btn'  color="secondary" onClick={() => downloadPDF('approved-table', 'Approved_Professors')} variant="contained">Download Approved Professors PDF</Button>
      <br />
      <br />
      <Typography variant="h4">Suspended Professors</Typography>
      <br />
      <Table id="suspended-table">
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
          {suspendedprofessors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell>{professor.name}</TableCell>
              <TableCell>{professor.email}</TableCell>
              <TableCell>{professor.specialization}</TableCell>
              <TableCell>{professor.qualification}</TableCell>
              <TableCell>{professor.phoneNumber}</TableCell>
              <TableCell>
                <Button onClick={() => handleApprove(professor.id)} variant="contained" color="success">
                  ReInstate
                </Button>
                <Button onClick={() => handleDelete(professor.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <Button className='btn'  color="secondary" onClick={() => downloadPDF('suspended-table', 'Suspended_Professors')} variant="contained">Download Suspended Professors PDF</Button>
      <br />
      <br />
      <Typography variant="h4">Rejected Professors</Typography>
      <br />
      <Table id="rejected-table">
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
          {rejectedprofessors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell>{professor.name}</TableCell>
              <TableCell>{professor.email}</TableCell>
              <TableCell>{professor.specialization}</TableCell>
              <TableCell>{professor.qualification}</TableCell>
              <TableCell>{professor.phoneNumber}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(professor.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <Button className='btn'  color="secondary" onClick={() => downloadPDF('rejected-table', 'Rejected Professors')} variant="contained">Download Rejected Professors PDF</Button>
      <br />
    </TableContainer>
  );
};

export default PendingProfessors;
