import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createComment } from "../commentsSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { LogInButton } from "../../user/components/LogInButton";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid",
  borderColor: "primary.main",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const CommentCreationPopup = ({ id }) => {
  const { user, isAuthenticated } = useAuth0();

  console.log("id in modal", id);
  console.log("user data is:", user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const [formData, setFormData] = useState({
    content: "",
    rating: "",
  });

  const handleClose = () => {
    setFormData({
      content: "",
      rating: "",
    });
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   const handleOtherInputChange = (key, value) => {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [key]: value,
  //     }));
  //   };

  const submitComment = (event) => {
    event.preventDefault();

    if (!formData.rating) {
      alert("Please add a rating");
      return;
    }

    let date = new Date().toLocaleDateString("fr-FR");

    dispatch(
      createComment({
        ...formData,
        submitted_by: user.email,
        destination_id: id,
        creatorName: user.nickname,
        date: date,
      })
    );

    handleClose();
  };

  return (
    <Box>
      <Button onClick={handleOpen} variant="contained">
        Share your experience and rate the place
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Comment-creation-modal"
        aria-describedby="modal-to-create-Comment"
      >
        <Box component="form" sx={style} onSubmit={submitComment}>
          {isAuthenticated ? (
            <Stack spacing={2} alignItems={"stretch"}>
              <Typography variant="h4">Share your experience</Typography>
              <Grid item  pb={2} >
                <Typography pb={1} component="legend">
                  Rate your experience:
                </Typography>
                {/* <SpotRating
                  handleInputChange={handleInputChange}
                  value={formData.rating}
                /> */}
              </Grid>

              <TextField
                label="Your comment"
                placeholder="Relate your work & surf experience"
                type="text"
                id="content"
                name="content"
                multiline
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
                required
              />

              <Button type="submit" variant="contained">
                Post your comment
              </Button>
            </Stack>
          ) : (
            <Grid container direction="column" alignItems="center">
              <Typography variant="h6" gutterBottom>
                You must logged in to submit a new spot
              </Typography>
              <LogInButton />
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
