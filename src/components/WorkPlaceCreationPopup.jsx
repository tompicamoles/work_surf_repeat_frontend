import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createWorkPlace } from "./workPlacesSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { LogInButton } from "./LogInButton";
import { GoogleMapsWorkspaceIdFinder } from "./formCompents/GoogleMapsWorkspaceIdFinder";
import { WorkPlaceGoogleInfo } from "./formCompents/WorkPlaceGoogleInfo";
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

export const WorkPlaceCreationPopup = ({ id }) => {
  const { user, isAuthenticated } = useAuth0();

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    adress: "",
    rating: 4,
    googleId: "",
    latitude: null,
    longitude: null,
  });

  const handleClose = () => {
    setFormData({
      name: "",
      type: "",
      image: "",
      adress: "",
      rating: 4,
      googleId: "",
      latitude: null,
      longitude: null,
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

  const saveGoogleId = (event, value) => {
    console.log("event and value are:", event, value);
    setFormData((prevData) => ({
      ...prevData,
      googleId: value?.place_id || "",
    }));
  };

  const savePlaceDetails = (place) => {
    console.log("latitude", place.geometry.location.lat);
    setFormData((prevData) => ({
      ...prevData,

      name: place.name,
      adress: place.formatted_address,
      rating: place.rating,
      longitude: place.geometry.location.lng(),
      latitude: place.geometry.location.lat(),
    }));
  };

  const createPlace = (event) => {
    event.preventDefault();

    dispatch(
      createWorkPlace({
        ...formData,
        submited_by: user.email,
        destination_id: id,
        creatorNickname: user.nickname,
        likes: user.email,
      })
    );

    handleClose();
  };

  return (
    <Box>
      <Button onClick={handleOpen} variant="contained">
        Recommand a place to work form
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="WorkPlace-creation-modal"
        aria-describedby="modal-to-create-workPlace"
      >
        <Box component="form" sx={style} onSubmit={createPlace}>
          {isAuthenticated ? (
            <Stack spacing={2} alignItems={"stretch"}>
              <Typography variant="h4">Submit work place</Typography>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel required id="type">
                  Type
                </InputLabel>
                <Select
                  id="type"
                  label="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {["café", "coworking", "coliving"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.type && (
                <GoogleMapsWorkspaceIdFinder onChange={saveGoogleId} id={id} />
              )}
              {formData.googleId !== "" && (
                <WorkPlaceGoogleInfo
                  id={formData.googleId}
                  savePlaceDetails={savePlaceDetails}
                  formData={formData}
                />
              )}
              {/* <TextField
                label="name"
                placeholder="name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              /> */}

              {/* <TextField
                id="adress"
                label="adress"
                name="adress"
                multiline
                rows={2}
                value={formData.adress}
                onChange={handleInputChange}
                required
              />
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                id="rating"
                value={formData.rating}
                onChange={handleInputChange}
                precision={0.5}
                min={1}
              /> */}
              <Button type="submit" variant="contained">
                Submit work place
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
