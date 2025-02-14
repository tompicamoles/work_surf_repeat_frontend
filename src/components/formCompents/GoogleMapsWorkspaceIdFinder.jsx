import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Autocomplete, Box, TextField } from "@mui/material";
import { getCountryCode } from "../../modules/countriesData";
import {  selectSpots } from "../spotsSlice";
import { useSelector } from "react-redux";

export const GoogleMapsWorkspaceIdFinder = ({onChange, id}) => {
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const spot = useSelector(selectSpots)[id]
  const countryCode = getCountryCode(spot.country)

  useEffect(() => {
    if (!places) return;

    const autocomplete = new places.AutocompleteService();

    if (inputValue) {
      const request = {
        input: `${spot.name} ${inputValue}`,
        types: ["establishment"],
        componentRestrictions: { country: [countryCode] },
        fields: ["geometry", "name", "formatted_address"],
      };

      autocomplete.getPlacePredictions(request, (results, status) => {
        if (status === "OK" && results) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      });
    } else {
      setPredictions([]);
    }
  }, [places, countryCode, inputValue, spot.name]);

  return (
    <Box
      className="autocomplete-container"
      sx={{ maxWidth: 300, margin: "auto", mt: 4 }}
    >
      <Autocomplete
        options={predictions}
        getOptionLabel={(option) => `${option.description}`}
        onChange={onChange}
        name="googleId"
        noOptionsText="type name to see suggestions"
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Place name" name="googleId" />
        )}
        isOptionEqualToValue={(option, value) =>
          option.place_id === value.place_id
        }
      />
    </Box>
  );
};
