import { useState } from "react";
import {

  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Grid, Typography } from "@mui/material";

export const WorkPlaceMarker = ({
  latitude,
  longitude,
  name,
  adress,
  type,
  rating,
}) => {
  const [open, setOpen] = useState(false);
  console.log("marker workplace is: ", name);
  const position = { lat: latitude, lng: longitude };
  console.log("position is", position);
  return (
    <>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <Pin />
      </AdvancedMarker>

      {open && (
        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
          <Grid container maxWidth={200} justifyContent="center">
            <Grid item xs={12}>
              <Typography>{name}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption">{type}</Typography>
            </Grid>
            <Grid item container xs={4} justifyContent={"flex-end"}>
              <Typography variant="caption">{rating}/5</Typography>
            </Grid>
          </Grid>
        </InfoWindow>
      )}
    </>
  );
};
