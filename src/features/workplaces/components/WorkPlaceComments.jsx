import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const WorkPlaceComments = ({
  commentedRatings,
  currentUserId,
  onEditRating,
}) => {
  const [showAllComments, setShowAllComments] = useState(false);

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

  const handleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };
  return (
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
              <Box sx={{ mb: 1 }}>
                {/* First row: User info and edit button */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: { xs: 1, sm: 0.5 },
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0, // Allow text to shrink
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: "120px", sm: "200px" },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      {rating.user_nickname
                        ? rating.user_nickname
                        : "Anonymous"}
                    </Typography>
                    {isUserRating && (
                      <Chip
                        label="You"
                        size="small"
                        color="primary"
                        variant="filled"
                        sx={{ fontSize: "0.75rem", flexShrink: 0 }}
                      />
                    )}
                  </Box>

                  {isUserRating && onEditRating && (
                    <IconButton
                      size="small"
                      onClick={() => onEditRating(rating)}
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          color: "primary.dark",
                        },
                        flexShrink: 0,
                      }}
                      title="Edit your rating"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {/* Second row: Rating and date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                    flexWrap: "wrap",
                  }}
                >
                  <Rating
                    value={rating.rating}
                    readOnly
                    size="small"
                    precision={0.5}
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "primary.main",
                      },
                      "& .MuiRating-iconEmpty": {
                        color: "grey.300",
                      },
                      "& .MuiRating-iconHover": {
                        color: "primary.main",
                      },
                      flexShrink: 0,
                    }}
                  />
                  <Chip
                    label={formatRelativeDate(rating.created_at)}
                    size="small"
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
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
  );
};
