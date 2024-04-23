import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import Notification from '../Notification';

function CreateLessons() {
  const { courseId, lessonCount } = useParams();
  const [lessonData, setLessonData] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // console.log(lessonData);

      const lessonsToCreate = lessonData.map((lesson, index) => ({
        courseId: courseId,
        lessonNumber: index + 1,
        lessonTitle: lesson.lessonTitle,
        lessonContent: lesson.lessonContent,
      }));

      // console.log("Lessons to create: ",lessonsToCreate);

      const createdLessons = await Promise.all(
        lessonsToCreate.map((lesson) =>
          axios.post('https://localhost:7178/api/Lessons', lesson, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      console.log(createdLessons);

      const updatedLessonData = lessonData.map(() => ({
        lessonTitle: '',
        lessonContent: '',
      }));
      setLessonData(updatedLessonData);

      setNotification({
        open: true,
        message: 'Lessons created successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating lessons:', error);
      setNotification({
        open: true,
        message: 'An error occurred while creating the lessons.',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedLessonData = [...lessonData];
    updatedLessonData[index] = {
      ...updatedLessonData[index],
      [name]: value,
    };
    setLessonData(updatedLessonData);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        Create Lessons
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {Array.from({ length: lessonCount }, (_, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="h6" gutterBottom>
                Lesson {index + 1}
              </Typography>
              <TextField
                fullWidth
                label={`Lesson Title ${index + 1}`}
                name={`lessonTitle`}
                value={lessonData[index] ? lessonData[index].lessonTitle : ''}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              <TextField
                fullWidth
                label={`Lesson Content ${index + 1}`}
                name={`lessonContent`}
                value={lessonData[index] ? lessonData[index].lessonContent : ''}
                onChange={(e) => handleInputChange(index, e)}
                multiline
                rows={4}
                required
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Container>
  );
}

export default CreateLessons;
