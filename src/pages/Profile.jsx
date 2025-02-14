import { Grid, Link, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import Spots from "../components/Spots";
import { useSelector } from "react-redux";
import { selectSpots } from "../components/spotsSlice";

export const Profile = () => {
  const { user, isAuthenticated, isLoading, user_metadata } = useAuth0();
  console.log("user info:", 
    user, 
    //user_metadata, isAuthenticated, isLoading
    );
  const navigate = useNavigate();
  let spots = useSelector(selectSpots);

  function filterCreatedSpots() {
    let filteredSpots = {};

    // Iterate over the keys of the spots object
    for (let key in spots) {
      console.log(key);
      // Check if the search parameter is included in the name or country
      if (spots[key].submitedBy === user.email) {
        // If it matches, add the spot to the filteredSpots array
        console.log(key, "was created by user");
        filteredSpots[key] = spots[key];
      }
    }
    console.log(filteredSpots);
    return filteredSpots;
  }

  const createdSpots = filterCreatedSpots();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        pathname: "/",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isAuthenticated && (
      <Grid container p={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom sx={{ display: { xs: "none", sm: "block" } }}>
            {" "}
            Welcome {user.nickname}!
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ display: { xs: "block", sm: "none" } }}>
            {" "}
            Hi {user.nickname}!
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
