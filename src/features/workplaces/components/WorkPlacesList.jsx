import { Button, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkPlaces } from "../workPlacesSlice";
import WorkPlaceCard from "./WorkPlaceCard";

function WorkPlacesList({ type }) {
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

  let title = titles[type];
  console.log(type, workPlaces);

  if (!workPlaces) {
    <Typography p={3} variant="h6">
      Loading...
    </Typography>;
  } else if (Object.keys(workPlaces).length === 0) {
    return (
      <Grid container p={2}>
        <Typography variant="h6" paddingBottom={1}>
          Be first to recommand {title}.
        </Typography>
        <Grid item xs={12}>
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

        {Object.entries(workPlaces)
          .slice(0, visibleCount)
          .map(([id]) => (
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
