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
import { createWorkPlace, selectWorkPlaces } from "../workPlacesSlice";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../user/userSlice";
import { LogInButton } from "../../user/components/LogInButton";
import { GoogleMapsWorkspaceIdFinder } from "./forms/GoogleMapsWorkspaceIdFinder";
import { WorkPlaceGoogleInfo } from "./forms/WorkPlaceGoogleInfo";
import AuthPopup from "../../user/components/AuthPopup";

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
  const workPlaces = useSelector(selectWorkPlaces);
  console.log("work places are:", workPlaces);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();

  const [isCreationPopupOpen, setIsCreationPopupOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isAlreadyExisting, setIsAlreadyExisting] = useState(false);

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

  const handleOpen = () => {
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
    } else {
      setIsCreationPopupOpen(true);
    }
  };

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
    setIsCreationPopupOpen(false);
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

  const saveGoogleId = (_event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      googleId: value?.place_id || "",
    }));
  };

  const savePlaceDetails = (place) => {
    setFormData((prevData) => ({
      ...prevData,
      id: place.place_id,
      name: place.name,
      adress: place.formatted_address,
      rating: place.rating,
      longitude: place.geometry.location.lng(),
      latitude: place.geometry.location.lat(),
    }));
  };

  const checkIfWorkPlaceAlreadyExists = (type, id) => {
    const workPlace = workPlaces[type][id];
    return workPlace !== undefined;
  };

  const createPlace = (event) => {
    event.preventDefault();

    if (isAlreadyExisting) {
      alert("work place already exists");
      return;
    }

    dispatch(
      createWorkPlace({
        ...formData,
        spotId: id,
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
        open={isCreationPopupOpen}
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
                <GoogleMapsWorkspaceIdFinder
                  onChange={(event, value) => {
                    saveGoogleId(event, value);
                    if (value?.place_id) {
                      setIsAlreadyExisting(
                        checkIfWorkPlaceAlreadyExists(
                          formData.type,
                          value.place_id
                        )
                      );
                    }
                  }}
                  id={id}
                />
              )}
              {formData.googleId !== "" && !isAlreadyExisting && (
                <WorkPlaceGoogleInfo
                  id={formData.googleId}
                  savePlaceDetails={savePlaceDetails}
                  formData={formData}
                />
              )}
              {formData.googleId !== "" && isAlreadyExisting && (
                <> ⚠️Spot already existing ⚠️</>
              )}
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
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
    </Box>
  );
};
