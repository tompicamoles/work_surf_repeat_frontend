import { AttachMoney, House, LaptopMac, Wifi } from "@mui/icons-material";
import { Box, Grid, Link, Paper, Tooltip, Typography } from "@mui/material";
import { FaSnowman, FaSun } from "react-icons/fa";
import { GiMapleLeaf, GiSprout } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { displayListOfMonths } from "../../../common/utils/utils";
import { selectSpot } from "../spotsSlice";

import { lifeCostLabels } from "./formComponents/LifeCost";
import { wifiLabels } from "./formComponents/WifiRating";
import LikeSpotButton from "./LikeSpotButton";

function SpotCard({ id }) {
  // const dispatch = useDispatch();

  const spot = useSelector((state) => selectSpot(state, id));

  // Defensive programming - handle loading state
  if (!spot) {
    return (
      <Grid item container>
        <Paper
          sx={{
            display: "flex",
            minHeight: 200,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Loading spot...</Typography>
        </Paper>
      </Grid>
    );
  }

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

          <Grid
            container
            item
            xs={6}
            alignContent={"flex-end"}
            justifyContent="flex-start"
          >
            <Tooltip
              title={`Best surf season : ${displayListOfMonths(
                spot.surfSeason
              )}.`}
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
                      ["6", "7", "8", "All year round"].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiMapleLeaf
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      ["9", "10", "11", "All year round"].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <FaSnowman
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      ["12", "1", "2", "All year round"].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
                <GiSprout
                  size={20}
                  color={
                    spot.surfSeason.some((month) =>
                      ["3", "4", "5", "All year round"].includes(month)
                    )
                      ? "#05668D"
                      : "rgba(74,74,74,0.38)"
                  }
                />
              </Box>
            </Tooltip>
          </Grid>
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
            </Grid>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SpotCard;
