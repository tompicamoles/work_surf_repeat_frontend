import SpotCard from "./SpotCard";
import { selectSpots, isLoadingSpots } from "../spotsSlice";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { selectCurrentUser } from "../../user/userSlice";
import { useSearchParams } from "react-router-dom";
import { SpotCardSkeleton } from "./SpotCardSkeleton";

const Spots = ({ context }) => {
  const user = useSelector(selectCurrentUser);

  let spots = useSelector(selectSpots);

  const [searchParams] = useSearchParams();

  const spotSearch = searchParams.get("spot");
  const isLoading = useSelector(isLoadingSpots);

  function filterSpotsByNameOrCountry() {
    let filteredSpots = {};

    // Iterate over the keys of the spots object
    for (let key in spots) {
      // Check if the search parameter is included in the name or country
      if (
        spots[key].name.toLowerCase().includes(spotSearch.toLowerCase()) ||
        spots[key].country.toLowerCase().includes(spotSearch.toLowerCase())
      ) {
        // If it matches, add the spot to the filteredSpots array
        filteredSpots[key] = spots[key];
      }
    }
    return filteredSpots;
  }

  if (spotSearch) {
    spots = filterSpotsByNameOrCountry();
  }

  function filterLikedSpots() {
    let filteredSpots = {};

    // Iterate over the keys of the spots object
    for (let key in spots) {
      // Check if the search parameter is included in the name or country
      if (spots[key].likeUserIds.includes(user.id)) {
        // If it matches, add the spot to the filteredSpots array
        filteredSpots[key] = spots[key];
      }
    }
    console.log(filteredSpots);
    return filteredSpots;
  }

  if (context === "likedSpots") {
    spots = filterLikedSpots();
  }

  return (
    <Grid id="spotsGrid" container direction="row">
      {isLoading
        ? // find cleaner way to generate an array to iterate over
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
            <Grid
              // replace this grid by a styles component such as CardGrid to avoid duplicating all the Grid Props
              key={key}
              item
              container
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              p={0.5}
              sx={{
                width: "100%",
                minHeight: 250,
                maxHeight: 300,
              }}
            >
              <SpotCardSkeleton />{" "}
            </Grid>
          ))
        : Object.entries(spots).map(([id]) => (
            <Grid
              key={id}
              item
              container
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              p={0.5}
              sx={{
                width: "100%",
                minHeight: 250,
                maxHeight: 300,
              }}
            >
              <SpotCard id={id} />{" "}
            </Grid>
          ))}
    </Grid>
  );
};

export default Spots;
