import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSpots, likeSpot } from "./spotsSlice";
import { useAuth0 } from "@auth0/auth0-react";

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
import { commaSeparator } from "../modules/commaSeparator";
import { wifiLabels } from "./formCompents/WifiRating";
import { lifeCostLabels } from "./formCompents/LifeCost";

import { GiMapleLeaf, GiSprout } from "react-icons/gi";
import { FaSun, FaSnowman } from "react-icons/fa";

import { GiWaveSurfer } from "react-icons/gi";

function LikeSpotButton({ id }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();

  const spot = useSelector(selectSpots)[id];
  const numberOfLikes = spot.likes.length;

  const handleLikeButton = () => {
    if (isAuthenticated) {
      let newListOfLikes = [...spot.likes];
      !spot.likes.includes(user.email)
        ? newListOfLikes.push(user.email)
        : (newListOfLikes = newListOfLikes.filter(
            (like) => like !== user.email
          ));
      newListOfLikes.length === 0 && newListOfLikes.push("tom");

      const likeData = {
        id: id,
        likes: newListOfLikes,
      };

      dispatch(likeSpot(likeData));
    } else {
      alert(
        "you must log in to like a spot and add it to your liked spots list"
      );
    }
  };

  let userLikedDestination = false;
  if (isAuthenticated) {
    if (spot.likes.includes(user.email)) {
      // We wait to make sure the user is logged in before getting the nickname to prevent errors linked to aysinc
      userLikedDestination = true;
    }
  }

  return (
   
        <Tooltip
          title={
            isAuthenticated ? "Like and add to wishlist" : `Log in to like`
          }
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="add"
            onClick={() => isAuthenticated && handleLikeButton()}
          >
            <ThumbUpAlt color={userLikedDestination ? "primary" : "disabled"} />
            <Typography marginLeft={-1} marginTop={2.5} color="black">
              {numberOfLikes}
            </Typography>
          </Fab>
        </Tooltip>
      
  );
}

export default LikeSpotButton;
