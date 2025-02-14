import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { selectSpots } from "./spotsSlice";
import { getCountryLifecost, getCountrySurfSeason } from "../modules/countriesData";

import {
  TextField,
  FormGroup,
  FormControlLabel,
  Box,
  Button,
  Typography,
  Modal,
  Switch,
  Stack,
  Fab,
  Grid,
} from "@mui/material";

import { CountrySelect } from "./formCompents/CountrySelect";

import { createSpot } from "./spotsSlice";
import { useDispatch } from "react-redux";
import WifiRating from "./formCompents/WifiRating";
import LevelSelector from "./formCompents/LevelSelector";
import LifeCost from "./formCompents/LifeCost";
import MonthSelector from "./formCompents/MonthSelector";
import AddIcon from "@mui/icons-material/Add";
import { LogInButton } from "./LogInButton";

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

  const { user, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      name: "",
      country: null,
      // level: [],
      surfSeason: [],
      wifiQuality: null,
      hasCoworking: false,
      hasColiving: false,
      // lifeCost: null,
    });
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    country: null,
    // level: [],
    surfSeason: [],
    wifiQuality: null,
    hasCoworking: false,
    hasColiving: false,
    // lifeCost: null,
  });

  const checkAlreadyExisting = () => {
    console.log("running checkAlreadyExistingSpot")
    
    let destinationExists = false
    // Iterate over the keys of the spots object
    for (let key in spots) {
      console.log(key);
      // Check if the search parameter is included in the name or country
      if (
        (spots[key].name.toLowerCase().includes(formData.name.toLowerCase())) &&(
        spots[key].country
          .toLowerCase()
          .includes(formData.country.toLowerCase())
      )) {
        // If it matches, add the spot to the filteredSpots array
        console.log(key, "was already created");
        return true
        
      
      }
    }
    console.log(destinationExists)

    return destinationExists
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    // Check if the input is a checkbox
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

  const createDestination = (event) => {
    event.preventDefault();

    if(checkAlreadyExisting() === true){
      alert( `${formData.name}, ${formData.country} has been created already`)
      return
    }

    if (!formData.wifiQuality) {
      alert("Please fill Wifi Qualify");
      return;
    }

    console.log("country to send", formData.country);
    const spotData = {
      name: formData.name,
      country: formData.country,
      // level: formData.level,
      surfSeason: getCountrySurfSeason(formData.country),
      wifiQuality: formData.wifiQuality,
      hasCoworking: formData.hasCoworking,
      hasColiving: formData.hasColiving,
      lifeCost: getCountryLifecost(formData.country),
      submitedBy: user.email,
      creatorNickname: user.nickname,
      likes: [user.email],
    };
    dispatch(createSpot(spotData));
    console.log("creator:", spotData.creatorNickname);
    console.log("submitedBy: ", spotData.submitedBy);

    handleClose();
  };

  return (
    <Box>
      <Button variant="contained" color="primary" aria-label="add" onClick={handleOpen} >Add a new destination</Button>
      {/* <Fab color="primary" aria-label="add" onClick={handleOpen}>
        <AddIcon />
      </Fab> */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="spot-creation-modal"
        aria-describedby="modal-to-create-spot"
      >
        <Box component="form" sx={style} onSubmit={createDestination}>
          {isAuthenticated ? (
            <Stack spacing={2} alignItems={"stretch"}>
              <Typography variant="h4" color="primary" gutterBottom>
                {" "}
                Submit a spot
              </Typography>

              <TextField
                label="Spot Name"
                placeholder="Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <CountrySelect
                value={formData.country}
                context="popup"
                handleOtherInputChange={handleOtherInputChange}
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
              />
              <Typography component="legend">Life cost:</Typography>
              <LifeCost
                context="popup"
                handleInputChange={handleInputChange}
                value={formData.lifeCost}
              ></LifeCost>

              {/* <MonthSelector
                context="popup"
                handleInputChange={handleInputChange}
                surfSeason={formData.surfSeason}
              /> */}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasCoworking}
                      id="hasCoworking"
                      name="hasCoworking"
                      onChange={handleInputChange}
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
                    />
                  }
                  label="Has Coliving"
                />
              </FormGroup>

              <Button type="submit" variant="contained">
                Save destination
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
}

export default SpotCreationPopup;
