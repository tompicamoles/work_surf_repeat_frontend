import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectCurrentUser } from "../../user/userSlice";
import {
  isLoadingSpots,
  loadMoreSpots,
  selectDisplayedSpotsCount,
  selectHasMore,
  selectIsLoadingMore,
  selectSpots,
} from "../spotsSlice";
import SpotCard from "./SpotCard";
import { SpotCardSkeleton } from "./SpotCardSkeleton";

const Spots = ({ context }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  let spots = useSelector(selectSpots);
  const isLoading = useSelector(isLoadingSpots);
  const hasMore = useSelector(selectHasMore);
  const isLoadingMore = useSelector(selectIsLoadingMore);
  const displayedCount = useSelector(selectDisplayedSpotsCount);

  const [searchParams] = useSearchParams();
  const spotSearch = searchParams.get("spot");

  // Ref for the sentinel element (invisible element at bottom of list)
  const sentinelRef = useRef(null);

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

  // Load more spots - now just reveals more from already-loaded data
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      dispatch(loadMoreSpots());
    }
  }, [dispatch, hasMore, isLoadingMore, isLoading, displayedCount]);

  // Set up Intersection Observer for infinite scrolling
  useEffect(() => {
    // Only enable auto-loading for non-filtered views
    if (spotSearch || context) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When sentinel element becomes visible, load more
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        // Trigger when 20% of sentinel is visible
        threshold: 0.2,
        // Start loading a bit before reaching the bottom
        rootMargin: "100px",
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleLoadMore, spotSearch, context]);

  const showInfiniteScroll = !spotSearch && !context;
  const spotsArray = spots.slice(0, displayedCount);

  // 🐛 DEBUG: Log current state
  console.log("📊 Current Spots state:", {
    spotsCount: spotsArray.length,
    displayedCount,
    hasMore,
    isLoadingMore,
    isLoading,
    showInfiniteScroll,
    spotSearch,
    context,
  });

  return (
    <Box>
      <Grid id="spotsGrid" container direction="row">
        {isLoading && spotsArray.length === 0
          ? // Show skeletons only on initial load (when no spots loaded yet)
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
              <Grid
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
                <SpotCardSkeleton />
              </Grid>
            ))
          : spotsArray.map((spot) => (
              <Grid
                key={spot.id}
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
                <SpotCard id={spot.id} />
              </Grid>
            ))}
      </Grid>

      {/* Show results count */}
      {spotsArray.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {spotsArray.length} destinations
            {showInfiniteScroll && hasMore && " (scroll for more)"}
          </Typography>
        </Box>
      )}

      {/* Sentinel element for infinite scrolling - invisible trigger element */}
      {showInfiniteScroll && hasMore && (
        <Box
          ref={sentinelRef}
          sx={{
            height: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0",
          }}
        />
      )}

      {/* Manual Load More button for filtered views or as fallback */}
      {showInfiniteScroll && hasMore && spotsArray.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              console.log("🖱️ Manual Load More button clicked");
              handleLoadMore();
            }}
            disabled={isLoadingMore}
            sx={{
              minWidth: "150px",
              borderRadius: "20px",
            }}
          >
            {isLoadingMore ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Loading...
              </>
            ) : (
              "Load More Spots"
            )}
          </Button>
        </Box>
      )}

      {/* Loading indicator for automatic "load more" */}
      {isLoadingMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            gap: 1,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading more spots...
          </Typography>
        </Box>
      )}

      {/* End of results message */}
      {!hasMore && spotsArray.length > 0 && showInfiniteScroll && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🏄‍♂️ You've seen all the spots! Add more destinations to discover new
            places.
          </Typography>
        </Box>
      )}

      {/* No results message */}
      {spotsArray.length === 0 && !isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No destinations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {spotSearch
              ? `No spots match "${spotSearch}". Try a different search term.`
              : context === "likedSpots"
              ? "You haven't liked any spots yet. Start exploring!"
              : "No destinations available. Be the first to add one!"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Spots;
