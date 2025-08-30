import { Add, LocationOn, RateReview, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectWorkPlaceById } from "../workPlacesSlice";
import AddRatingPopup from "./AddRatingPopup";
import { WorkPlaceComments } from "./WorkPlaceComments";

function WorkPlaceCard({ type, id }) {
  const place = useSelector((state) => selectWorkPlaceById(state, type, id));
  const session = useSelector((state) => state.user.session);
  const [showComments, setShowComments] = useState(false);
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
  const [editingRating, setEditingRating] = useState(null);

  // Defensive programming - handle case where place might not exist
  if (!place) {
    return <div>Workplace not found</div>;
  }

  // Use real data from the place object
  const commentedRatings = place.ratings.filter((rating) => rating.comment);
  const numberOfCommentedRatings = commentedRatings.length;

  // Check if current user has already rated this workplace
  const currentUserId = session?.user?.id;
  const userExistingRating = currentUserId
    ? commentedRatings.find((rating) => rating.user_id === currentUserId)
    : null;
  const hasUserRated = !!userExistingRating;

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleOpenRatingPopup = () => {
    setEditingRating(null); // Clear edit mode for new rating
    setRatingPopupOpen(true);
  };

  const handleEditRating = (rating) => {
    setEditingRating(rating); // Set the rating to edit
    setRatingPopupOpen(true);
  };

  const handleCloseRatingPopup = () => {
    setRatingPopupOpen(false);
    setEditingRating(null); // Clear edit state
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
          <WorkPlaceComments
            commentedRatings={commentedRatings}
            currentUserId={currentUserId}
            onEditRating={handleEditRating}
          />
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
        isEditMode={!!editingRating}
        existingRating={editingRating?.rating}
        existingComment={editingRating?.comment}
      />
    </Grid>
  );
}

export default WorkPlaceCard;
