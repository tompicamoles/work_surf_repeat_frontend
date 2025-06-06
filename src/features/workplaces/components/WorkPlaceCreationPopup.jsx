import { Delete, PhotoCamera } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPopup from "../../user/components/AuthPopup";
import { LogInButton } from "../../user/components/LogInButton";
import { selectSession } from "../../user/userSlice";
import { createWorkPlace, selectWorkPlaces } from "../workPlacesSlice";
import { GoogleMapsWorkspaceIdFinder } from "./forms/GoogleMapsWorkspaceIdFinder";
import { WorkPlaceGoogleInfo } from "./forms/WorkPlaceGoogleInfo";

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

  const session = useSelector(selectSession);

  const dispatch = useDispatch();

  const [isCreationPopupOpen, setIsCreationPopupOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isAlreadyExisting, setIsAlreadyExisting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    adress: "",
    rating: 3,
    googleId: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    // Revoke the object URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleOpen = () => {
    if (!session) {
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
      rating: 3,
      googleId: "",
      latitude: null,
      longitude: null,
    });
    setErrorMessage("");
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    console.log("place rating from google:", place.rating);
    setFormData((prevData) => ({
      ...prevData,
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image file size must be less than 5MB");
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setErrorMessage(""); // Clear any previous errors
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        selectedFile: selectedFile,
      })
    );

    handleClose();
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
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
            {session ? (
              <Stack spacing={2} alignItems={"stretch"}>
                <Typography variant="h4">Submit work place</Typography>

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}

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
                  <> ⚠️ This work place already exists ⚠️</>
                )}

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{
                    mb: 1,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    py: 1.5,
                    color: "text.secondary",
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : "Upload Image (Optional)"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>

                {selectedFile && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveImage}
                    startIcon={<Delete />}
                    sx={{ mb: 1 }}
                  >
                    Remove Image
                  </Button>
                )}

                {previewUrl && (
                  <Box
                    component="img"
                    sx={{
                      height: 100,
                      width: "auto",
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                      alignSelf: "center",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                    alt="Selected image preview"
                    src={previewUrl}
                  />
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
    </APIProvider>
  );
};
