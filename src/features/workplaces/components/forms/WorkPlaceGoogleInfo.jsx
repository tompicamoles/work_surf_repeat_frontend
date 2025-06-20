import { LocationOn } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export const WorkPlaceGoogleInfo = ({ id, savePlaceDetails, formData }) => {
  const googlePlaces = useMapsLibrary("places");

  const saveDetails = (googlePlaceId) => {
    const service = new googlePlaces.PlacesService(
      document.createElement("div")
    ); // it is mandatory to pass a "map" as an argument for some wierd reasons
    service.getDetails(
      { placeId: googlePlaceId },
      (googlePlaceData, status) => {
        if (status === googlePlaces.PlacesServiceStatus.OK) {
          savePlaceDetails(googlePlaceData);
        }
      }
    );
  };

  useEffect(() => {
    saveDetails(id);
  }, [id]);

  return (
    <>
      <Typography variant="h5"> {formData.name} </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOn sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          {formData.adress}
        </Typography>
      </Box>
    </>
  );
};
