import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';

const BatchForm = () => {
  const [batch, setBatch] = useState({
    startDate: '',
    endDate: '',
    courseDuration: '',
  });

  useEffect(() => {
    const courseDuration = localStorage.getItem('courseDuration');
    if (courseDuration) {
      setBatch((prevBatch) => ({
        ...prevBatch,
        courseDuration: courseDuration,
      }));
    }
  }, []);

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    const endDate = calculateEndDate(startDate);
    setBatch({
      ...batch,
      startDate,
      endDate,
    });
  };

  const calculateEndDate = (startDate) => {
    // Calculate the end date based on the start date and course duration
    // For demonstration, assuming course duration is in months
    const courseDuration = parseInt(localStorage.getItem('courseDuration'), 10); // Retrieve from local storage
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + courseDuration);
    
    // Format end date as "yyyy-mm-dd" for proper parsing
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
    
    return formattedEndDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const courseId = parseInt(localStorage.getItem('courseId'), 10); // Retrieve from local storage
      const token = localStorage.getItem('token');

      const isValidStartDate = !isNaN(new Date(batch.startDate).getTime());
      const isValidEndDate = !isNaN(new Date(batch.endDate).getTime());

    if (!isValidStartDate || !isValidEndDate) {
      console.error('Invalid start date or end date');
      return;
    }

      // Add other fields to the batch object if needed
      const newBatch = {
        ...batch,
        courseId,
        startDate: new Date(batch.startDate).toISOString(),
        endDate: new Date(batch.endDate).toISOString(),
      };

      // Make API call to create the batch
      const response = await axios.post('https://localhost:7178/api/Batches', newBatch, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle successful creation
      console.log('Batch created:', response.data);

      // Reset the form
      setBatch({
        startDate: '',
        endDate: '',
        courseDuration: '',
      });

      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Batch
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="courseDuration"
          label="Course Duration (in months)"
          type="text"
          disabled
          value={batch.courseDuration}
          fullWidth
          margin="normal"
        />
        <Typography>Start Date</Typography>
        <TextField
          name="startDate"
          //label="Start Date"
          type="date"
          required
          value={batch.startDate}
          onChange={handleStartDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="endDate"
          label="End Date (dd-mm-yyyy)"
          type="text"
          disabled
          value={batch.endDate}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Create Batch
        </Button>
      </form>
    </Container>
  );
};

export default BatchForm;
