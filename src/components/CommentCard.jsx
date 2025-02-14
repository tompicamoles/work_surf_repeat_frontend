import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import { StarRate } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectComments } from "./commentsSlice";

export const CommentCard = ({ id }) => {
  const comment = useSelector(selectComments)[id];
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <Grid p={1} container xs={12} lg={6}>
      <Card sx={{ width: "100%" }}>
        <CardContent component={"div"}>
          <Grid item container xs={12} justifyContent={"space-between"} pb={.5}>
            <Typography variant="subtitle2">
              {comment.date}, by <i>{comment.creatorNickname}</i>.
            </Typography>

            <Rating
              name="half-rating"
              value={comment.rating}
              precision={0.5}
              icon={<StarRate color="primary" fontSize="inherit" />}
              emptyIcon={<StarRate color="disabled" fontSize="inherit" />}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant="body">
              "{showMore ? comment.content : `${comment.content.slice(0, 200)}...`}"
            </Typography>
            {comment.content.length > 200 && (
              <Button onClick={handleShowMore}>
                {showMore ? "Show less" : "Show more"}
              </Button>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
