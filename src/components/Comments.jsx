import { Typography, Grid, Button, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { selectComments } from "../components/commentsSlice";
import { CommentCard } from "./CommentCard";
import { CommentCreationPopup } from "./CommentCreationPopup";

export const Comments = ({ id }) => {
  const comments = useSelector(selectComments);
  console.log("comments", comments);

  return (
    <>
      <Grid container >
        <Grid container item>
          <Typography variant="h6">Comments</Typography>
        </Grid>
        <Grid container item justifyContent={"center"} pb={2}>
          <CommentCreationPopup id={id} />
        </Grid>

        {Object.entries(comments).map(([id]) => (
          <CommentCard id={id} />
        ))}
      </Grid>
    </>
  );
};
