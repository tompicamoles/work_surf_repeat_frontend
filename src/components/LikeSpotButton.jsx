import { useDispatch, useSelector } from "react-redux";
import { selectSpots, likeSpot } from "./spotsSlice";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Link,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Wifi,
  AttachMoney,
  LaptopMac,
  House,
  ThumbUpAlt,
} from "@mui/icons-material";

import AuthPopup from "./AuthPopup";
import { useState } from "react";
import { selectIsAuthenticated, selectCurrentUser } from "./userSlice";

function LikeSpotButton({ id }) {
  const [isLikePopupOpen, setIsLikePopupOpen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const spot = useSelector(selectSpots)[id];
  const numberOfLikes = spot.totalLikes;

  const handleLikeButton = () => {
    if (isAuthenticated) {
      dispatch(likeSpot(id));
    } else {
      setIsLikePopupOpen(true);
    }
  };

  let userLikedDestination = isAuthenticated && spot.likeUserIds?.includes(user.id);
  // if (isAuthenticated) {
  //   // if (spot.likes.includes(user.email)) {
  //   if (false) {
  //     // We wait to make sure the user is logged in before getting the nickname to prevent errors linked to aysinc
  //     userLikedDestination = true;
  //   }
  // }

  return (
    <>
      <Tooltip
        title={isAuthenticated ? "Like and add to wishlist" : `Log in to like`}
      >
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
        isOpen={isLikePopupOpen}
        onClose={() => setIsLikePopupOpen(false)}
      />
    </>
  );
}

export default LikeSpotButton;
