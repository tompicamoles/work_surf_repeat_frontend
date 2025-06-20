import { Add, LocationOn, RateReview, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkPlaces } from "../workPlacesSlice";
import AddRatingPopup from "./AddRatingPopup";

function WorkPlaceCard({ type, id }) {
  const place = useSelector(selectWorkPlaces)[type][id];
  const session = useSelector((state) => state.user.session);
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);

  // Use real data from the place object
  const commentedRatings = place.ratings.filter((rating) => rating.comment);
  const numberOfCommentedRatings = commentedRatings.length;

  // Check if current user has already rated this workplace
  const currentUserId = session?.user?.id;
  const userExistingRating = currentUserId
    ? commentedRatings.find((rating) => rating.user_id === currentUserId)
    : null;
  const hasUserRated = !!userExistingRating;

  // Show limited comments initially, then all if requested
  const commentsToShow = showAllComments
    ? commentedRatings
    : commentedRatings.slice(0, 5);

  // Helper function to format ISO date string as relative time
  const formatRelativeDate = (isoString) => {
    // Handle ISO string format: "2024-01-15T10:30:00.000Z"
    if (!isoString) return "Unknown date";

    const date = new Date(isoString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 30) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    } else if (diffInDays > 7) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    } else {
      return "Just now";
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleOpenRatingPopup = () => {
    setRatingPopupOpen(true);
  };

  const handleCloseRatingPopup = () => {
    setRatingPopupOpen(false);
  };

  return (
    <Grid id="place" container item p={2} spacing={2} xs={12} width="100%">
      {/* Image Section */}
      <Grid item sm={3} sx={{ display: { xs: "none", sm: "block" } }}>
        <Paper
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${place.image_link})`,
            minHeight: 120,
            width: "100%",
            borderRadius: 2,
          }}
        />
      </Grid>

      {/* Main Content Section */}
      <Grid item container xs={12} sm={9} spacing={2}>
        {/* Name and Address */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            {place.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocationOn
              sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {place.adress}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RateReview />}
              onClick={handleShowComments}
              disabled={numberOfCommentedRatings === 0}
            >
              {showComments
                ? "Hide Comments"
                : `Show Comments (${numberOfCommentedRatings})`}
            </Button>
            <Tooltip
              title={
                hasUserRated
                  ? "You have already rated this place"
                  : "Add Rating"
              }
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleOpenRatingPopup}
                  disabled={hasUserRated}
                >
                  Add Rating
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Grid>

        {/* Rating Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
            }}
          >
            {/* Rating Display */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Star sx={{ color: "primary.main", mr: 0.5 }} />
              <Typography variant="h6" sx={{ mr: 1 }}>
                {place.averageRating
                  ? place.averageRating.toFixed(1)
                  : "No ratings"}
              </Typography>
              {place.totalRatings > 0 && (
                <Typography variant="body2" color="text.secondary">
                  ({place.totalRatings} rating
                  {place.totalRatings !== 1 ? "s" : ""})
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Comments Section */}
        {showComments && numberOfCommentedRatings > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Comments
              </Typography>
              {commentsToShow.map((rating, index) => {
                const isUserRating =
                  currentUserId && rating.user_id === currentUserId;

                return (
                  <Box
                    key={`${rating.work_place_id}-${rating.user_id}-${index}`}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {rating.user_id}
                      </Typography>
                      {isUserRating && (
                        <Chip
                          label="You"
                          size="small"
                          color="primary"
                          variant="filled"
                          sx={{ mr: 1, fontSize: "0.75rem" }}
                        />
                      )}
                      <Rating
                        value={rating.rating}
                        readOnly
                        size="small"
                        precision={0.5}
                        sx={{
                          mr: 1,
                          "& .MuiRating-iconFilled": {
                            color: "primary.main",
                          },
                          "& .MuiRating-iconEmpty": {
                            color: "grey.300",
                          },
                          "& .MuiRating-iconHover": {
                            color: "primary.main",
                          },
                        }}
                      />
                      <Chip
                        label={formatRelativeDate(rating.created_at)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    {rating.comment && (
                      <Typography variant="body2" color="text.secondary">
                        {rating.comment}
                      </Typography>
                    )}
                  </Box>
                );
              })}

              {commentedRatings.length > 5 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleShowAllComments}
                  sx={{ mt: 1 }}
                >
                  {showAllComments
                    ? "Show Less"
                    : `Show ${commentedRatings.length - 5} More Comments`}
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Divider */}
      <Grid item xs={12}>
        <Divider sx={{ mt: 2 }} />
      </Grid>

      {/* Rating Popup */}
      <AddRatingPopup
        open={ratingPopupOpen}
        onClose={handleCloseRatingPopup}
        type={type}
        workPlaceId={place.id}
        placeName={place.name}
      />
    </Grid>
  );
}

export default WorkPlaceCard;
