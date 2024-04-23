import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

function SignupProfessor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    qualification: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    status: 'Pending',
    qualificationCertificate: null,
  });
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [signupsuccess, setSignUpSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [qualificationCertificate, setQualificationCertificate] = useState('');
  const [qualificationCertificateName, setQualificationCertificateName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQualificationCertificate(reader.result);
      setQualificationCertificateName(file.name);
    };
    reader.readAsDataURL(file);
    if (file) {
      const certificateBase64 = qualificationCertificate.split(',')[1];
      setFormData({ ...formData, qualificationCertificate: certificateBase64 });
      setFileError('');
    } else {
      setFormData({ ...formData, qualificationCertificate: null });
      setFileError('Qualification Certificate is required');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const { name, email, specialization, qualification, phoneNumber, password, confirmPassword, qualificationCertificate } = formData;

    if (!name || !email || !specialization || !qualification || !phoneNumber || !password || !confirmPassword || !qualificationCertificate) {
      setSubmitError('All fields are required');
      return;
    }

    setSubmitError('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}/.test(password)) {
        setPasswordError('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. Minimum length is 8 characters.');
        return;
      }

    setPasswordError('');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    console.log(formData);

    try {
      const response = await fetch('https://localhost:7178/api/Professors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify(formData) // Convert form data to JSON
      });
      console.log('Signup successful');
      setSignUpSuccess('Signup successful! Wait for the Approval');
      clearForm();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setSubmitError(errors[Object.keys(errors)[0]]);
      } else {
        console.error('Signup failed:', error.message);
        setSubmitError('Signup failed');
      }
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      specialization: '',
      qualification: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      status: 'Pending',
      qualificationCertificate: null,
    });
    setFileError('');
    setSubmitError('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Professor Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Specialization"
              variant="outlined"
              fullWidth
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Qualification"
              variant="outlined"
              fullWidth
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="qualification-certificate"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="qualification-certificate">
              <Button variant="contained" component="span">
                Upload Qualification Certificate
              </Button>
            </label>
            {formData.qualificationCertificate && (
              <Typography variant="body1" gutterBottom>
                File Selected: {formData.qualificationCertificate.name}
              </Typography>
            )}
            {fileError && (
              <Typography variant="body2" color="error" gutterBottom>
                {fileError}
              </Typography>
            )}
            {submitError && (
                <Typography variant="body2" color="error" gutterBottom>
                {submitError}
              </Typography>
            )}
            {signupsuccess && (
                <Typography variant="body2" color="success" gutterBottom>
                {signupsuccess}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography>
        Already have an Account! <Link to="/login">Login Here</Link>
      </Typography>
    </Container>
  );
}

export default SignupProfessor;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, TextField, Typography, Container, Grid } from '@mui/material';
// import { Link } from 'react-router-dom';

// function SignupProfessor() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [specialization, setSpecialization] = useState('');
//   const [qualification, setQualification] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [status, setStatus] = useState('Pending');
//   const [qualificationCertificate, setQualificationCertificate] = useState(null);
//   const [errors, setErrors] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({}); // Reset errors

//     if (password !== confirmPassword) {
//       setErrors({ confirmPassword: "Passwords do not match!" });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('specialization', specialization);
//     formData.append('qualification', qualification);
//     formData.append('phoneNumber', phoneNumber);
//     formData.append('password', password);
//     formData.append('confirmPassword', confirmPassword);
//     formData.append('status', status);

//     // Convert image file to byte array
//     if (qualificationCertificate) {
//       const reader = new FileReader();
//       reader.readAsArrayBuffer(qualificationCertificate);
//       reader.onload = () => {
//         const byteArray = new Uint8Array(reader.result);
//         formData.append('qualificationCertificate', byteArray, qualificationCertificate.name);
//         sendPostRequest(formData);
//       };
//       reader.onerror = () => {
//         console.error('Error reading file.');
//       };
//     } else {
//       // If no file selected, show error
//       setErrors({ qualificationCertificate: "Qualification Certificate is required" });
//     }
//   };

//   const sendPostRequest = async (formData) => {
//     try {
//       const response = await axios.post('https://localhost:7178/api/Professors', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log('Signup successful:', response.data);
//       setErrors({}); // Clear any previous errors
//       // You can redirect the user to another page upon successful signup
//       clearForm();
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrors(error.response.data.errors);
//       } else {
//         console.error('Signup failed:', error.message);
//       }
//     }
//   };

//   const clearForm = () => {
//     setName('');
//     setEmail('');
//     setSpecialization('');
//     setQualification('');
//     setPhoneNumber('');
//     setPassword('');
//     setConfirmPassword('');
//     setStatus('Pending');
//     setQualificationCertificate(null);
//     setErrors({});
//   };

//   const handleFileChange = (e) => {
//     setQualificationCertificate(e.target.files[0]);
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" align="center" gutterBottom>
//         Professor Signup
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               error={errors.name != null}
//               helperText={errors.name}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Email"
//               type="email"
//               variant="outlined"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={errors.email != null}
//               helperText={errors.email}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Specialization"
//               variant="outlined"
//               fullWidth
//               value={specialization}
//               onChange={(e) => setSpecialization(e.target.value)}
//               error={errors.specialization != null}
//               helperText={errors.specialization}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Qualification"
//               variant="outlined"
//               fullWidth
//               value={qualification}
//               onChange={(e) => setQualification(e.target.value)}
//               error={errors.qualification != null}
//               helperText={errors.qualification}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Phone Number"
//               variant="outlined"
//               fullWidth
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               error={errors.phoneNumber != null}
//               helperText={errors.phoneNumber}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               error={errors.password != null}
//               helperText={errors.password}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Confirm Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               error={errors.confirmPassword != null}
//               helperText={errors.confirmPassword}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <input
//               accept="image/*"
//               id="qualification-certificate"
//               type="file"
//               style={{ display: 'none' }}
//               onChange={handleFileChange}
//             />
//             <label htmlFor="qualification-certificate">
//               <Button variant="contained" component="span">
//                 Upload Qualification Certificate
//               </Button>
//             </label>
//             {errors.qualificationCertificate && (
//               <Typography variant="body1" color="error" gutterBottom>
//                 {errors.qualificationCertificate}
//               </Typography>
//             )}
//             {qualificationCertificate && (
//               <Typography variant="body1" gutterBottom>
//                 File Selected: {qualificationCertificate.name}
//               </Typography>
//             )}
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" color="primary">
//               Sign Up
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <Typography>Already have an Account! <Link to="/login">Login Here</Link></Typography>
//     </Container>
//   );
// }

// export default SignupProfessor;
