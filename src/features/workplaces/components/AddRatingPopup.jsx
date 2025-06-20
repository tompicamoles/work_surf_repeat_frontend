import {
  Alert,
  Box,
  Button,
  Modal,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitWorkPlaceRating } from "../workPlacesSlice";

const AddRatingPopup = ({ open, onClose, workPlaceId, placeName, type }) => {
  const dispatch = useDispatch();
  const { isLoadingRatingSubmission, failedToSubmitRating } = useSelector(
    (state) => state.workPlaces
  );
  const session = useSelector((state) => state.user.session);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
    maxWidth: 500,
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = async () => {
    if (!session) {
      setError("You must be logged in to submit a rating");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setError("");

    try {
      await dispatch(
        submitWorkPlaceRating({
          type,
          workPlaceId,
          rating,
          comment: comment.trim() || null,
        })
      ).unwrap();

      // Reset form and close modal on success
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      setError(error.message || "Failed to submit rating");
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Stack spacing={3}>
          <Typography variant="h5" component="h2" gutterBottom>
            Rate {placeName}
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {failedToSubmitRating && (
            <Alert severity="error">
              Failed to submit rating. Please try again.
            </Alert>
          )}

          <Box>
            <Typography variant="body1" gutterBottom>
              Your Rating *
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              precision={0.5}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "primary.main",
                },
                "& .MuiRating-iconEmpty": {
                  color: "grey.300",
                },
                "& .MuiRating-iconHover": {
                  color: "primary.main",
                },
              }}
            />
          </Box>

          <TextField
            label="Comment (Optional)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience at this place..."
            fullWidth
            variant="outlined"
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoadingRatingSubmission || rating === 0}
            >
              {isLoadingRatingSubmission ? "Submitting..." : "Submit Rating"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddRatingPopup;
