import { Delete, PhotoCamera } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPopup from "../../user/components/AuthPopup";
import { selectSession } from "../../user/userSlice";
import { createSpot, selectSpots } from "../spotsSlice";

import { CountrySelect } from "./formComponents/CountrySelect";
import WifiRating from "./formComponents/WifiRating";

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

function SpotCreationPopup() {
  let spots = useSelector(selectSpots);
  const isLoading = useSelector((state) => state.spots.isLoadingSpotCreation);
  const session = useSelector(selectSession);

  const dispatch = useDispatch();

  const [isCreationPopupOpen, setIsCreationPopupOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpen = () => {
    if (!session) {
      setIsAuthPopupOpen(true);
    } else {
      setIsCreationPopupOpen(true);
    }
  };
  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        country: null,
        surfSeason: [],
        wifiQuality: null,
        hasCoworking: false,
        hasColiving: false,
      });
      setErrorMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsCreationPopupOpen(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    country: null,
    surfSeason: [],
    wifiQuality: null,
    hasCoworking: false,
    hasColiving: false,
  });

  useEffect(() => {
    // Revoke the object URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const checkAlreadyExisting = () => {
    let destinationExists = false;
    for (let key in spots) {
      if (
        spots[key].name.toLowerCase().includes(formData.name.toLowerCase()) &&
        spots[key].country
          .toLowerCase()
          .includes(formData.country.toLowerCase())
      ) {
        return true;
      }
    }

    return destinationExists;
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "hasCoworking" || name === "hasColiving") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // Use checked property for checkboxes
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleOtherInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const createDestination = async (event) => {
    event.preventDefault();

    if (checkAlreadyExisting() === true) {
      setErrorMessage(
        `${formData.name}, ${formData.country} has been created already`
      );
      return;
    }

    if (!formData.wifiQuality) {
      setErrorMessage("Please fill Wifi Quality");
      return;
    }

    const spotData = {
      name: formData.name,
      country: formData.country,
      wifiQuality: formData.wifiQuality,
      hasCoworking: formData.hasCoworking,
      hasColiving: formData.hasColiving,
      selectedFile: selectedFile,
    };

    try {
      await dispatch(createSpot(spotData)).unwrap();
      // Only close if the action was successful
      handleClose();
    } catch (error) {
      console.error("Create spot error:", error);
      // Extract message from error response based on different possible formats
      let errorMsg = "Failed to create spot. Please try again.";

      if (typeof error === "string") {
        errorMsg = error;
      } else if (error?.data?.message) {
        errorMsg = error.data.message;
      } else if (error?.success === false && error?.message) {
        errorMsg = error.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
    }
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

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={handleOpen}
      >
        Add a new destination
      </Button>
      {/* <Fab color="primary" aria-label="add" onClick={handleOpen}>
        <AddIcon />
      </Fab> */}

      <Modal
        open={isCreationPopupOpen}
        onClose={handleClose}
        aria-labelledby="spot-creation-modal"
        aria-describedby="modal-to-create-spot"
      >
        <Box component="form" sx={style} onSubmit={createDestination}>
          <Stack spacing={2} alignItems={"stretch"}>
            <Typography variant="h4" color="primary" gutterBottom>
              {" "}
              Submit a spot
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <TextField
              label="Spot Name"
              placeholder="Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <CountrySelect
              value={formData.country}
              context="popup"
              handleOtherInputChange={handleOtherInputChange}
              disabled={isLoading}
            />

            {/* <LevelSelector
                id="level"
                level={formData.level}
                context="popup"
                handleOtherInputChange={handleOtherInputChange}
              ></LevelSelector> */}

            <Typography component="legend">Wifi quality:</Typography>

            <WifiRating
              context="popup"
              value={formData.wifiQuality}
              handleInputChange={handleInputChange}
              disabled={isLoading}
            />

            <Button
              variant="outlined"
              component="label"
              disabled={isLoading}
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
                disabled={isLoading}
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

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasCoworking}
                    id="hasCoworking"
                    name="hasCoworking"
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                }
                label="Has Coworking"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasColiving}
                    name="hasColiving"
                    id="hasColiving"
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                }
                label="Has Coliving"
              />
            </FormGroup>

            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save destination"
              )}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
    </Box>
  );
}

export default SpotCreationPopup;
