import { Skeleton, Typography } from "@mui/material";

export function SpotCardSkeleton() {
  return (
    <>
      <Skeleton variant="rectangular" width="100%">
        <div style={{ paddingTop: "57%" }} />
      </Skeleton>

      <Skeleton variant="text" width="100%" height="50px">
        {" "}
        <Typography>.</Typography>
      </Skeleton>
      <Skeleton variant="text" width="100%">
        {" "}
        <Typography>.</Typography>
      </Skeleton>
    </>
  );
}
