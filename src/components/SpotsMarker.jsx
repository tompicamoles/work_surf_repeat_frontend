import { useState } from "react";
import {

  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { selectSpots } from "./spotsSlice";
import { useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import SpotCard from "./SpotCard";

export const SpotMarker = ({
  id,
  latitude,
  longitude,
  name,
  country,
  
}) => {
  const [open, setOpen] = useState(false);
  const position = { lat: latitude, lng: longitude };
  const spot = useSelector(selectSpots)[id];

  console.log("position is", position);
  return (
    <>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <Pin />
      </AdvancedMarker>

      {open && (
        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
          <Grid container maxWidth={200}  justifyContent="center">
          <SpotCard id={id} key={id}/></Grid>
        </InfoWindow>
      )}
    </>
  );
};
