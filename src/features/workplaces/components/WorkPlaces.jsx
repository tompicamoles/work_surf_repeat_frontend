"use client";

import { Grid } from "@mui/material";
import { WorkPlaceCreationPopup } from "./WorkPlaceCreationPopup";
import WorkPlacesList from "./WorkPlacesList";
import WorkPlacesMap from "./WorkPlacesMap";

export const WorkPlaces = ({ id }) => {
  return (
    <>
      {" "}
      <Grid item lg={7} xs={12} id="workPlacesLists" minHeight={500}>
        <Grid
          item
          container
          justifyContent={"flex-end"}
          sx={{ mb: 2, paddingRight: 2 }}
        >
          <WorkPlaceCreationPopup id={id} />
        </Grid>

        <WorkPlacesList type="café" />
        <WorkPlacesList type="coworking" />
        <WorkPlacesList type="coliving" />
      </Grid>
      <Grid item container xs={12} lg={5}>
        <WorkPlacesMap id={id} />
      </Grid>
    </>
  );
};
