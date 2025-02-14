import { Rating, Box, Typography } from "@mui/material";
import { StarRate } from "@mui/icons-material";
import { useState } from "react";



export const SpotRating = ({ value, handleInputChange }) => {
  const [hover, setHover] = useState(-1);

  

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Rating
        id="rating"
        name="rating"
        icon={<StarRate color="primary" fontSize="inherit" />}
        emptyIcon={<StarRate color="disabled" fontSize="inherit" />}
        
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        value={value}
        onChange={handleInputChange}
      />
      {/* {context === "popup" && (
        <Typography variant="body2" sx={{ ml: 2 }}>
          {lifeCostLabels[hover !== -1 ? hover : value]}
        </Typography>
      )} */}
    </Box>
  );
};

