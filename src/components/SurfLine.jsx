import { Button, Grid } from "@mui/material";
import React from "react";

export const SurfLine = ({ url }) => {
  return (
    <Grid
    
      container
      justifyContent={"center"}
      sx={{minHeight:400}}
      onClick={() => window.open(url, "_blank")
      
    }
    >
      <Button variant="contained" target="_blank" href={url} sx={{marginBottom: 3}}>
        {" "}
        Visit Surfline to discover all the nearby surf spots{" "}
      </Button>

      <iframe
        title="Website Preview"
        src={url}
        width="100%"
        height="500px"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </Grid>
  );
};
