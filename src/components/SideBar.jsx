import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Paper } from "@mui/material";
import { useState } from "react";
import LevelSelector from "./formCompents/LevelSelector";
import WifiRating from "./formCompents/WifiRating";
import LifeCost from "./formCompents/LifeCost";
import MonthSelector from "./formCompents/MonthSelector";
import { CountrySelect } from "./formCompents/CountrySelect";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useDispatch } from "react-redux";
import { loadSpots } from "./spotsSlice";

function SideBar({setFilterButton}) {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    country: null,
    level: [],
    surfSeason: [],
    wifiQuality: null,
    hasCoworking: false,
    hasColiving: false,
    lifeCost: null,
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    // Check if the input is a checkbox
    if (name === "hasCoworking" || name === "hasColiving") {
      setFilters((prevData) => ({
        ...prevData,
        [name]: checked, // Use checked property for checkboxes
      }));
    } else {
      setFilters((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleOtherInputChange = (key, value) => {
    setFilters((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const filterResults = (event) => {
    event.preventDefault();
    setFilterButton(false)
    dispatch(loadSpots(filters))
  };

  const resetFilters = () => {
    setFilters({
      country: null,
      level: [],
      surfSeason: [],
      wifiQuality: null,
      hasCoworking: false,
      hasColiving: false,
      lifeCost: null,
    })

    dispatch(loadSpots());
    setFilterButton(false)
  };

  return (
    <Paper sx={{ width: "100%" }} id="sideBar">
      <Box component="form" onSubmit={filterResults}>
        <Stack spacing={2} p={2}>
          <Typography variant="h6"> filter destinations</Typography>
          <CountrySelect
            value={filters.country}
            context="filter"
            handleOtherInputChange={handleOtherInputChange}
          />

          {/* <LevelSelector
            id="level"
            level={filters.level}
            context="filter"
            handleOtherInputChange={handleOtherInputChange}
          ></LevelSelector> */}

          <Typography component="legend">Wifi quality:</Typography>

          <WifiRating
            value={filters.wifiQuality}
            handleInputChange={handleInputChange}
          />
          <Typography component="legend">Life cost:</Typography>
          <LifeCost
            context="filter"
            handleInputChange={handleInputChange}
            value={filters.lifeCost}
          ></LifeCost>

          <MonthSelector
            handleInputChange={handleInputChange}
            context="select"
            surfSeason={filters.surfSeason}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.hasCoworking}
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
                  checked={filters.hasColiving}
                  name="hasColiving"
                  id="hasColiving"
                  onChange={handleInputChange}
                />
              }
              label="Has Coliving"
            />
          </FormGroup>

          <Grid container justifyContent="space-around">
            <Button
              endIcon={<FilterAltIcon />}
              sx={{ width: 200 }}
              type="submit"
              variant="contained"
            >
              apply filters
            </Button>
            <Button variant="outlined" onClick={resetFilters}>
              {" "}
              reset
            </Button>
          </Grid>
        </Stack>
      </Box>
    </Paper>
  );
}

export default SideBar;
