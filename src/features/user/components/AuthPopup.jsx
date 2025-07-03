import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearAuthError,
  clearAuthSuccess,
  forgotPassword,
  selectAuthError,
  selectAuthSuccess,
  selectForgotPasswordLoading,
  selectSession,
  selectSignInLoading,
  selectSignUpLoading,
  signIn,
  signUp,
} from "../userSlice";

const AuthPopup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const signUpLoading = useSelector(selectSignUpLoading);
  const signInLoading = useSelector(selectSignInLoading);
  const forgotPasswordLoading = useSelector(selectForgotPasswordLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);

  const [authView, setAuthView] = useState("sign_in"); // 'sign_in', 'sign_up', 'forgot_password'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    resetEmail: "",
  });

  // Close modal when session changes to a valid session
  useEffect(() => {
    if (session) {
      onClose();
    }
  }, [session, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAuthView("sign_in");
      setFormData({
        email: "",
        password: "",
        nickname: "",
        resetEmail: "",
      });
      dispatch(clearAuthError());
      dispatch(clearAuthSuccess());
    }
  }, [isOpen, dispatch]);

  // Clear errors when switching views
  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [authView, dispatch]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 420 },
    maxWidth: 420,
    bgcolor: "background.paper",
    border: "2px solid",
    borderColor: "primary.main",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    await dispatch(
      signIn({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    await dispatch(
      signUp({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      })
    );
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await dispatch(
      forgotPassword({
        email: formData.resetEmail,
      })
    );
  };

  const renderSignInForm = () => (
    <Box component="form" onSubmit={handleSignIn}>
      <Stack spacing={2} alignItems="stretch">
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => dispatch(clearAuthSuccess())}
          >
            {success}
          </Alert>
        )}

        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={signInLoading}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={signInLoading}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={signInLoading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {signInLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Link
            component="button"
            type="button"
            onClick={() => setAuthView("forgot_password")}
            variant="body2"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot your password?
          </Link>
        </Box>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setAuthView("sign_up")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  const renderSignUpForm = () => (
    <Box component="form" onSubmit={handleSignUp}>
      <Stack spacing={2} alignItems="stretch">
        <Typography variant="h4" color="primary" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => dispatch(clearAuthSuccess())}
          >
            {success}
          </Alert>
        )}

        <TextField
          label="Nickname"
          name="nickname"
          value={formData.nickname}
          onChange={handleInputChange}
          required
          disabled={signUpLoading}
          fullWidth
          placeholder="How should we call you?"
        />

        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={signUpLoading}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={signUpLoading}
          fullWidth
          helperText="Password must be at least 6 characters"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={signUpLoading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {signUpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
        </Button>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setAuthView("sign_in")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  const renderForgotPasswordForm = () => (
    <Box component="form" onSubmit={handleForgotPassword}>
      <Stack spacing={2} alignItems="stretch">
        <Typography variant="h4" color="primary" gutterBottom>
          Reset Password
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => dispatch(clearAuthSuccess())}
          >
            {success}
          </Alert>
        )}

        <TextField
          label="Email Address"
          name="resetEmail"
          type="email"
          value={formData.resetEmail}
          onChange={handleInputChange}
          required
          disabled={forgotPasswordLoading}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={forgotPasswordLoading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {forgotPasswordLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setAuthView("sign_in")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  const renderCurrentView = () => {
    switch (authView) {
      case "sign_up":
        return renderSignUpForm();
      case "forgot_password":
        return renderForgotPasswordForm();
      default:
        return renderSignInForm();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal"
      aria-describedby="authentication-form"
    >
      <Box sx={style}>{renderCurrentView()}</Box>
    </Modal>
  );
};

export default AuthPopup;
