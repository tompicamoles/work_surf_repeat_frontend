import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser, selectError, selectIsLoading } from '../userSlice';

const AuthPopup = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();
      } else {
        await dispatch(signupUser({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })).unwrap();
      }
      onClose(); // Close the modal on success
    } catch (err) {
      // Error handling is managed by Redux
      console.error('Authentication error:', err);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid',
    borderColor: 'primary.main',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal"
      aria-describedby="authentication-form"
    >
      <Box component="form" sx={style} onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <Typography variant="h4" color="primary">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Typography>

          <TextField
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            fullWidth
          />

          {!isLogin && (
            <TextField
              label="Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
          )}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" display="inline">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Typography>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AuthPopup; 