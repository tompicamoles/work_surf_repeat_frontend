import { Grid, Link, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import Spots from "../features/spots/components/Spots";
import { useSelector } from "react-redux";
import { selectSpots } from "../features/spots/spotsSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "../features/user/userSlice";

export const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  console.log("user info:", user);
  const navigate = useNavigate();
  let spots = useSelector(selectSpots);

  const createdSpots = Object.entries(spots).reduce(
    (filteredSpots, [key, spot]) => {
      if (spot.submittedBy === user.id) {
        filteredSpots[key] = spot;
      }
      return filteredSpots;
    },
    {}
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        pathname: "/",
      });
    }
  }, []);

  return (
    isAuthenticated && (
      <Grid container p={3}>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {" "}
            Welcome {user.name}!
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            {" "}
            Hi {user.name}!
          </Typography>
        </Grid>

        <Grid item container direction={"column"} xs={12} md={7} pr={2}>
          <Typography variant="h5" gutterBottom>
            My liked spots:
          </Typography>
          <Spots context="likedSpots" />

          <Typography variant="h5" gutterBottom>
            Spots I recommanded:
          </Typography>
          {Object.entries(createdSpots).length === 0 ? (
            <Typography variant="body">
              You have not recommanded any spot yet
            </Typography>
          ) : (
            Object.entries(createdSpots).map(([id]) => (
              <Link
                component={RouterLink}
                underline="none"
                to={`/destination/${spots[id].id}`}
                name={spots[id].name}
              >
                <Typography>
                  {spots[id].name}, {spots[id].country}
                </Typography>
              </Link>
            ))
          )}
        </Grid>
        <Grid
          item
          container
          md={5}
          sx={{
            backgroundSize: "cover", // Adjust the size of the background image
            backgroundPosition: "center", // Center the background image
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(https://images.unsplash.com/photo-1527731149372-fae504a1185f?q=80&w=2661&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            minHeight: 400,
            width: 150,
            display: { xs: "none", md: "block" },
          }}
        ></Grid>
      </Grid>
    )
  );
};
