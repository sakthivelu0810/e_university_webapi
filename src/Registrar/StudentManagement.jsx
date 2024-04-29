import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      <Typography variant="h4">Pending Student Requests</Typography>
      <br />
      <Table id="pending-table">
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
      <br />
      <Button onClick={() => downloadPDF('pending-table', 'Pending_Students')} variant="contained">Download Pending Students PDF</Button>
      <br />
      <Typography variant="h4">Approve Students</Typography>
      <Table id="approved-table">
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
      <br />
      <Button onClick={() => downloadPDF('approved-table', 'Approved_Students')} variant="contained">Download Approved Students PDF</Button>
      <br />
      <Typography variant="h4">Suspended Students</Typography>
        <br />
      <Table id="suspended-table">
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
      <br />
      <Button onClick={() => downloadPDF('suspended-table', 'Suspended_Students')} variant="contained">Download Suspended Students PDF</Button>
      <br />
      <Typography variant="h4">Rejected Students</Typography>
        <br />
      <Table id="rejected-table">
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
      <br />
      <Button onClick={() => downloadPDF('rejected-table', 'Rejected_Students')} variant="contained">Download Rejected Students PDF</Button>
      <br /><br />

    </TableContainer>
  );
};

export default PendingStudents;
