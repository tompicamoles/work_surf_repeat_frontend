import { Business, Coffee, Home } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkPlaces } from "../workPlacesSlice";
import WorkPlaceCard from "./WorkPlaceCard";
import { WorkPlaceCreationPopup } from "./WorkPlaceCreationPopup";

function WorkPlacesList({ type, spotId }) {
  const workPlaces = useSelector(selectWorkPlaces)[type];

  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const titles = {
    café: "Laptop-friendly cafés",
    coworking: "Coworking Spaces",
    coliving: "Colivings",
  };

  const emptyStateText = {
    café: "Found a café with great WiFi and coffee? Share it with fellow remote workers.",
    coworking:
      "Know a productive coworking space? Help fellow remote workers find their ideal workspace.",
    coliving:
      "Discovered an amazing coliving? Share it and help fellow remote workers find their next home base.",
  };

  // Icon mapping for different workplace types
  const iconMap = {
    café: Coffee,
    coworking: Business,
    coliving: Home,
  };

  let title = titles[type];
  const IconComponent = iconMap[type] || Business;
  console.log(type, workPlaces);

  const workPlacesArray = Object.entries(workPlaces) || [];

  if (workPlacesArray.length === 0) {
    return (
      <Grid container sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, width: "100%" }}>
          {title}
        </Typography>

        {/* Enhanced Empty State */}
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              py: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                backgroundColor: "rgba(5, 102, 141, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent
                sx={{
                  fontSize: 30,
                  color: "primary.main",
                  opacity: 0.7,
                }}
              />
            </Box>

            <Typography
              variant="body1"
              align="start"
              sx={{
                color: "text.secondary",
              }}
            >
              {emptyStateText[type]}
            </Typography>
          </Box>
          {<WorkPlaceCreationPopup id={spotId} />}
        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>
          <Divider />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        id="placesList"
        container
        marginTop={2}
        spacing="0"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography marginBottom={1} variant="h6">
            {title}
          </Typography>
        </Grid>

        {workPlacesArray.slice(0, visibleCount).map(([id]) => (
          <WorkPlaceCard type={type} id={id} key={id} />
        ))}
        <Grid item container justifyContent={"flex-end"}>
          <Button
            sx={{ marginTop: -2 }}
            variant="text"
            onClick={handleShowMore}
          >
            Show more
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default WorkPlacesList;
