import { useDispatch, useSelector } from "react-redux";
import { selectSpot, likeSpot } from "../spotsSlice";

import {
  selectSession,
  selectCurrentUser,
} from "../../../features/user/userSlice";

import { Typography, Fab, Tooltip, CircularProgress } from "@mui/material";
import { ThumbUpAlt } from "@mui/icons-material";

import AuthPopup from "../../../features/user/components/AuthPopup";
import { useState } from "react";

function LikeSpotButton({ id }) {
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const session = useSelector(selectSession);

  const spot = useSelector((state) => selectSpot(state, id));

  // Defensive programming - handle loading state
  if (!spot) {
    return (
      <Fab size="small" color="secondary" disabled>
        <CircularProgress size={16} />
      </Fab>
    );
  }

  const numberOfLikes = spot.totalLikes || 0;

  const handleLikeButton = () => {
    if (session) {
      dispatch(likeSpot(id));
    } else {
      setIsAuthPopupOpen(true);
    }
  };

  let userLikedDestination = session && spot.likeUserIds?.includes(user.id);

  return (
    <>
      <Tooltip title={session ? "Like and add to wishlist" : `Log in to like`}>
        <Fab
          size="small"
          color="secondary"
          aria-label="add"
          onClick={() => handleLikeButton()}
        >
          <ThumbUpAlt color={userLikedDestination ? "primary" : "disabled"} />
          <Typography marginLeft={-1} marginTop={2.5} color="black">
            {numberOfLikes}
          </Typography>
        </Fab>
      </Tooltip>

      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
    </>
  );
}

export default LikeSpotButton;
