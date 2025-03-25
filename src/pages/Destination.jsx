import { Grid, Typography, Button, Divider, Fab, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadWorkPlaces } from "../features/workplaces/workPlacesSlice";
import { loadComments } from "../features/comments/commentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectSpots } from "../features/spots/spotsSlice";
import { WorkPlaces } from "../features/workplaces/components/WorkPlaces";
import { Comments } from "../features/comments/components/Comments";
import LikeSpotButton from "../features/spots/components/LikeSpotButton";
import { useTheme } from "@mui/material/styles";

const Destinations = () => {

  let { id } = useParams();
  const [buttonState, setButtonState] = useState("work");

  const spot = useSelector(selectSpots)[id];
  console.log("loadedspot : ", spot);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadWorkPlaces(id));
    dispatch(loadComments(id))
  }, [dispatch, id]);

  const handleButtonClick = (state) => {
    state === "work" ? setButtonState("work") : setButtonState("comments");
    console.log(buttonState);
  };

  if (!spot) {
    return <Typography variant="h6">Loading...</Typography>;
  } else {
    return (
      <Grid container p={3} spacing={1}>
        <Grid
          item
          container
          xs={12}
          direction="row"
          justifyContent="space-between"
          alignContent={"flex-end"}
          alignItems={"center"}
          pr={2}
          
          sx={{
            backgroundSize: "cover", // Adjust the size of the background image
            backgroundPosition: "center", // Center the background image
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${spot.image_link})`,
            minHeight:{ xs: 150, sm: 300 }
          }}
        >
          <Typography
            variant="subtitle2"
            color={"secondary"}
            
            sx={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.5) ", padding: { xs: 1, sm: 3 } }}
          >
            {" "}
            Destination submitted by {spot.creatorName}
          </Typography>
          
         

        </Grid>
        <Grid container item xs={12} alignItems={"center"} gap={2}>
          <Typography
            sx={{
              fontSize: {
                sm: 50, // Small screens
                xs: 30,
                
              },
            }}
          >
            {" "}
            {spot.name}, {spot.country}{" "}
          </Typography>
          <LikeSpotButton id={id} />
        </Grid>
        {/* <Grid item container xs={12}>
          <Button
            variant="text"
            sx={{
              color:
                buttonState === "work"
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
              "&:hover": {
                color: buttonState === "comments" && theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              handleButtonClick("work");
            }}
          >
            Where to work
          </Button>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Button
            variant="text"
            sx={{
              color:
                buttonState === "comments"
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
              "&:hover": {
                color: buttonState === "comments" && theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              handleButtonClick("comments");
            }}
          >
            Comments
          </Button>
        </Grid> */}

        {buttonState === "work" ? (
          <WorkPlaces id={id} />
        ) : (
          <Comments id={id}/>
        )}
      </Grid>
    );
  }
};

export default Destinations;
