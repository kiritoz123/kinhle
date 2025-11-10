import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import API from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await API.post('/api/auth/login', { email, password });
      localStorage.setItem('admin_token', res.data.token);
      navigate('/');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 12, p: 4 }}>
        <Typography variant="h5" gutterBottom>Admin Login</Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button variant="contained" type="submit">Login</Button>
        </Box>
      </Paper>
    </Container>
  );
}
