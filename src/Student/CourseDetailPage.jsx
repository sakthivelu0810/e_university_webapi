// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardHeader,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   FormControlLabel,
//   Paper,
// } from "@mui/material";
// import { useParams } from "react-router-dom";

// function CourseDetailPage() {
//   const { courseId } = useParams();
//   const batchId = new URLSearchParams(window.location.search).get("batchId");

//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);

//   useEffect(() => {
//     const fetchStudentLessons = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Fetch all student lessons for the current studentId
//         const studentId = localStorage.getItem("Id");
//         const response = await axios.get(
//           `https://localhost:7178/api/StudentLessons?studentId=${studentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const batchIdNumber = parseInt(batchId, 10);
//         const courseIdNumber = parseInt(courseId, 10);
//         // const batchForCourse = response.data.filter((studentbatch) => {
//         //   console.log(
//         //     "Comparing batchId:",
//         //     studentbatch.batchId,
//         //     "with",
//         //     batchId,
//         //     "Strict equality:",
//         //     studentbatch.batchId === batchId
//         //   );
//         //   return studentbatch.batchId === batchId;
//         // });

//         // Filter out lessons for the current courseId
//         const lessonsForCourse = response.data.filter(
//           (studentLesson) => studentLesson.courseId === courseIdNumber
//         );

//         const batchForCourse = lessonsForCourse.filter(
//           (studentbatch) => studentbatch.batchId === batchIdNumber
//         );

//         console.log("Batch for course ", batchForCourse);

//         // Sort the lessons by lessonNumber in ascending order
//         const sortedLessons = batchForCourse.sort(
//           (a, b) => a.lessonNumber - b.lessonNumber
//         );

//         setLessons(sortedLessons);
//       } catch (error) {
//         console.error("Error fetching student lessons:", error);
//       }
//     };

//     fetchStudentLessons();

//     const fetchCourseDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `https://localhost:7178/api/CourseDetails/ByCourseId/${courseId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setCourse(response.data);

//         // Fetch lessons for the course
//         // const lessonsResponse = await axios.get(
//         //   `https://localhost:7178/api/Lessons/ByCourseId/${courseId}`,
//         //   {
//         //     headers: {
//         //       Authorization: `Bearer ${token}`,
//         //     },
//         //   }
//         // );

//         // // Sort lessons by lessonNumber in ascending order
//         // const sortedLessons = lessonsResponse.data.sort(
//         //   (a, b) => a.lessonNumber - b.lessonNumber
//         // );
//         // setLessons(sortedLessons);
//       } catch (error) {
//         console.error("Error fetching course details:", error);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId])

//   const handleCheckboxChange = async (lessonId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Update the local state with the new completion status
//       const updatedLessons = lessons.map((lesson) =>
//         lesson.lessonId === lessonId ? { ...lesson, status: newStatus } : lesson
//       );
//       setLessons(updatedLessons);

//       // Send a PUT request to update the lesson status in StudentLessons table
//       await axios.put(
//         `https://localhost:7178/api/StudentLessons/${lessonId}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//     } catch (error) {
//       console.error("Error updating lesson status:", error);
//     }
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: 20 }}>
//       {course && (
//         <>
//           <Typography variant="h4" gutterBottom>
//             {course.courseName}
//           </Typography>
//           <Card>
//             <CardHeader title={`By ${course.professorName}`} />
//             <CardContent>
//               <Typography variant="body2" color="textSecondary" component="p">
//                 Lessons: {course.courseDuration} months
//               </Typography>
//               <Typography variant="body2" color="textSecondary" component="p">
//                 Description: {course.courseDescription}
//               </Typography>
//               <Typography variant="h6" gutterBottom>
//                 Lessons
//               </Typography>
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Lesson Number</TableCell>
//                       <TableCell>Lesson Title</TableCell>
//                       <TableCell>Lesson Content</TableCell>
//                       <TableCell>Status</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {lessons.map((lesson) => (
//                       <TableRow key={lesson.lessonId}>
//                         <TableCell>{lesson.lessonNumber}</TableCell>
//                         <TableCell>{lesson.lessonTitle}</TableCell>
//                         <TableCell>{lesson.lessonContent}</TableCell>
//                         <TableCell>
//                           <FormControlLabel
//                             control={
//                               <Checkbox
//                                 checked={lesson.status === "Completed"}
//                                 onChange={(e) =>
//                                   handleCheckboxChange(
//                                     lesson.lessonId,
//                                     e.target.checked
//                                       ? "Completed"
//                                       : "Not Completed"
//                                   )
//                                 }
//                               />
//                             }
//                             label={lesson.status}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </Container>
//   );
// }

// export default CourseDetailPage;

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
  Button, // Added Button component
} from "@mui/material";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

function CourseDetailPage() {
  const { courseId } = useParams();
  const batchId = new URLSearchParams(window.location.search).get("batchId");

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    
    const fetchStudentLessons = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all student lessons for the current studentId
        const studentId = localStorage.getItem("Id");
        const response = await axios.get(
          `https://localhost:7178/api/StudentLessons?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const batchIdNumber = parseInt(batchId, 10);
        const courseIdNumber = parseInt(courseId, 10);

        // Filter out lessons for the current courseId and batchId
        const lessonsForCourse = response.data.filter(
          (studentLesson) =>
            studentLesson.courseId === courseIdNumber &&
            studentLesson.batchId === batchIdNumber
        );

        // Sort the lessons by lessonNumber in ascending order
        const sortedLessons = lessonsForCourse.sort(
          (a, b) => a.lessonNumber - b.lessonNumber
        );

        setLessons(sortedLessons);
      } catch (error) {
        console.error("Error fetching student lessons:", error);
      }
    };

    fetchStudentLessons();

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
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);


  const generateCertificatePDF = (certificateData) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(`Certificate of Completion`, 105, 30, { align: "center" });

    doc.setFontSize(16);
    let yPos = 60;
    doc.text(`Course Name: ${certificateData.courseName}`, 20, yPos);
    yPos += 10;
    doc.text(`Professor: ${certificateData.professorName}`, 20, yPos);
    yPos += 10;
    doc.text(`Start Date: ${certificateData.startDate}`, 20, yPos);
    yPos += 10;
    doc.text(`End Date: ${certificateData.endDate}`, 20, yPos);
    yPos += 10;
    doc.text(`Course Duration: ${certificateData.courseDuration}`, 20, yPos);
    yPos += 20;

    doc.setFontSize(14);
    certificateData.lessons.forEach((lesson, index) => {
      doc.text(`${index + 1}. ${lesson.lessonTitle} - ${lesson.status}`, 20, yPos);
      yPos += 10;
    });

    return doc.output("blob");
  };


  const handleCheckboxChange = (lessonId, newStatus) => {
    const updatedLessons = lessons.map((lesson) =>
      lesson.lessonId === lessonId ? { ...lesson, status: newStatus } : lesson
    );
    setLessons(updatedLessons);
  };

  const allLessonsCompleted = lessons.every((lesson) => lesson.status === "Completed");

      console.log(allLessonsCompleted);

      const handleDownloadCertificate = () => {
        const certificateData = {
          courseName: course.courseName,
          professorName: course.professorName,
          startDate: course.startDate,
          endDate: course.endDate,
          courseDuration: course.courseDuration,
          lessons: lessons.map((lesson) => ({
            lessonTitle: lesson.lessonTitle,
            status: lesson.status,
          })),
        };
    
        const pdfBlob = generateCertificatePDF(certificateData);
    
        const pdfUrl = URL.createObjectURL(pdfBlob);
    
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "Certificate.pdf";
        document.body.appendChild(link);
    
        link.click();
    
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      };

  const handleSaveProgression = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log(lessons);

      // Create an array of updated lesson objects
      const updatedLessonData = lessons.map((lesson) => ({
        ...lesson,
        status: lesson.status,
      }));

      console.log(updatedLessonData);

      // const allLessonsCompleted = updatedLessonData.every(
      //   (lesson) => lesson.status === "Completed"
      // );

      // console.log(allLessonsCompleted);

      const studentId = localStorage.getItem("Id");

      // Send a PUT request to update all lessons' status in StudentLessons table
      await axios.put(
        `https://localhost:7178/api/StudentLessons/UpdateStudentLessons?studentId=${studentId}&batchId=${batchId}&courseId=${courseId}`,
        updatedLessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Optional: Show a success message or perform any other actions after saving
      console.log("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving progression:", error);
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
              <br />
              <br />
              <Typography variant="h4" gutterBottom>
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
              <Button variant="contained" onClick={handleSaveProgression}>
                Save Progression
              </Button>
              <Button
                variant="contained"
                onClick={handleDownloadCertificate}
                disabled={!allLessonsCompleted}
              >
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}

export default CourseDetailPage;
