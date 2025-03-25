import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSpots } from "../spotsSlice";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Link,
  Tooltip,
} from "@mui/material";
import {
  Wifi,
  AttachMoney,
  LaptopMac,
  House,
} from "@mui/icons-material";
import { displayListOfMonths } from "../../../common/utils/utils";
import { wifiLabels } from "./formComponents/WifiRating";
import { lifeCostLabels } from "./formComponents/LifeCost";
import { GiMapleLeaf, GiSprout } from "react-icons/gi";
import { FaSun, FaSnowman } from "react-icons/fa";
import LikeSpotButton from "./LikeSpotButton";

function SpotCard({ id }) {
  // const dispatch = useDispatch();
  // const { user, isAuthenticated } = useAuth0();

  const spot = useSelector(selectSpots)[id];

  // const numberOfLikes = spot.likes.length;

  // const handleLikeButton = () => {
  //   if (isAuthenticated) {
  //     let newListOfLikes = [...spot.likes];
  //     !spot.likes.includes(user.email)
  //       ? newListOfLikes.push(user.email)
  //       : (newListOfLikes = newListOfLikes.filter(
  //           (like) => like !== user.email
  //         ));
  //     newListOfLikes.length === 0 && newListOfLikes.push("tom");

  //     const likeData = {
  //       id: id,
  //       likes: newListOfLikes,
  //     };

  //     dispatch(likeSpot(likeData));
  //   } else {
  //     alert(
  //       "you must log in to like a spot and add it to your liked spots list"
  //     );
  //   }
  // };

  // let userLikedDestination = false;
  // if (isAuthenticated) {
  //   if (spot.likes.includes(user.email)) {
  //     // We wait to make sure the user is logged in before getting the nickname to prevent errors linked to aysinc
  //     userLikedDestination = true;
  //   }
  // }

  return (
    <Grid item container>
      <Paper
        item
        container
        xs={12}
        sx={{
          backgroundSize: "cover", // Adjust the size of the background image
          backgroundPosition: "center", // Center the background image
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${spot.image_link})`,
          display: "flex",
          minHeight: 200,
          width: "100%",
        }}
      >
        <Grid container p={2}>
          <Grid item container xs={6}>
            <Tooltip
              title={
                spot.hasCoworking
                  ? "Coworking space available."
                  : "No coworking space. "
              }
            >
              <Box
                sx={{
                  height: "20%",
                  p: 1,
                  borderRadius: 1.5,
                  bgcolor: "secondary.main",
                  m: 0.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LaptopMac
                  fontSize="small"
                  color={spot.hasCoworking ? "primary" : "disabled"}
                />
              </Box>
            </Tooltip>
            <Tooltip
              title={spot.hasColiving ? "Coliving available." : "No coliving."}
            >
              <Box
                sx={{
                  height: "20%",
                  borderRadius: 1.5,
                  p: 1,
                  bgcolor: "secondary.main",
                  m: 0.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <House
                  fontSize="small"
                  color={spot.hasColiving ? "primary" : "disabled"}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid
            item
            container
            xs={6}
            alignContent={"flex-start"}
            justifyContent="flex-end"
          >
            <LikeSpotButton id={id} />
          </Grid>

          {/* <Grid
            item
            container
            xs={6}
            alignContent={"flex-start"}
            justifyContent="flex-end"
          >
            <Tooltip
              title={
                isAuthenticated ? "Like and add to wishlist" : `Log in to like`
              }
            >
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                onClick={() => isAuthenticated && handleLikeButton()}
              >
                <ThumbUpAlt
                  color={userLikedDestination ? "primary" : "disabled"}
                />
                <Typography marginLeft={-1} marginTop={2.5} color="black">
                  {numberOfLikes}
                </Typography>
              </Fab>
            </Tooltip>
          </Grid> */}
          <Grid
            container
            item
            xs={6}
            alignContent={"flex-end"}
            justifyContent="flex-start"
          >
            <Tooltip
              title={`Best surf season : ${displayListOfMonths(spot.surfSeason)}.`}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "15%",
                  borderRadius: 1.5,
                  p: 1,
                  bgcolor: "secondary.main",
                  m: 0.5,
                }}
              >
                <FaSun
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      ["6", "7", "8", "All year round"].includes(
                        month
                      )
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiMapleLeaf
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      [
                        "9",
                        "10",
                        "11",
                        "All year round",
                      ].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <FaSnowman
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      [
                        "12",
                        "1",
                        "2",
                        "All year round",
                      ].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiSprout
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      ["3", "4", "5", "All year round"].includes(
                        month
                      )
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
              </Box>
            </Tooltip>
          </Grid>
          {/* <Grid
            item
            container
            xs={6}
            alignItems={"flex-end"}
            alignContent={"flex-end"}
            justifyContent="flex-end"
          >
            <Tooltip
              title={`Waves suitable for ${commaSeparator(
                spot.level
              )} surfers.`}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "15%",
                  borderRadius: 1.5,
                  p: 1,
                  bgcolor: "secondary.main",
                  m: 0.5,
                }}
              >
                <GiWaveSurfer
                  size={17}
                  color={
                    spot.level.includes("Beginner")
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiWaveSurfer
                  size={20}
                  color={
                    spot.level.includes("Intermediate")
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiWaveSurfer
                  size={23}
                  color={
                    spot.level.includes("Advanced")
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
              </Box>
            </Tooltip>
          </Grid> */}
        </Grid>
      </Paper>
      <Grid item container p={0.5} marginBottom={1} alignContent={"flex-start"}>
        <Tooltip title={`Wifi quality: ${wifiLabels[spot.wifiQuality]}`}>
          <Grid item xs={6}>
            {[...Array(5)].map((_, index) => {
              return (
                <Wifi
                  key={index}
                  sx={{ fontSize: 17 }}
                  color={index < spot.wifiQuality ? "primary" : "disabled"}
                ></Wifi>
              );
            })}
          </Grid>
        </Tooltip>
        <Tooltip title={`Life cost: ${lifeCostLabels[spot.lifeCost]}`}>
          <Grid item container xs={6} justifyContent="flex-end">
            {[...Array(5)].map((_, index) => {
              return (
                <AttachMoney
                  key={index}
                  sx={{ fontSize: 17 }}
                  color={index < spot.lifeCost ? "primary" : "disabled"}
                ></AttachMoney>
              );
            })}
          </Grid>
        </Tooltip>
        <Grid item marginTop={-0.5} xs={12}>
          <Link
            component={RouterLink}
            underline="none"
            to={`/destination/${spot.id}`}
            name={spot.name}
          >
            <Grid item container xs={12}>
              <Typography variant="h5" align="left">
                {spot.name}
              </Typography>
            </Grid>

            <Grid item container justifyContent="space-between" xs={12}>
              <Typography variant="h7" gutterBottom>
                {spot.country}
              </Typography>
              <Typography variant="h8" gutterBottom color={"grey"}>
                {" "}
                by {spot.creatorName}
              </Typography>
            </Grid>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SpotCard;
