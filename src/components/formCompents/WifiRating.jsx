import { Rating, Box, Typography } from "@mui/material";
import { Wifi } from "@mui/icons-material";
import { useState } from "react";


const wifiLabels = {
  1: `Emails only (> 100 kbps).`,
  2: "Some laggy Youtube videos (>1 Mbps).",
  3: "Zoom calls, no problemo (> 5 Mbps).",
  4: "Stream 4K Netflix all night (>20 Mbps).",
  5: "Fastest wifi you'll ever get (> 100 Mbps).",
};


const WifiRating = ({ value, handleInputChange, context }) => {
  const [hover, setHover] = useState(-1);

  
  function getLabelText(value) {
    return ` ${wifiLabels[value]}`;
  }

  return (
    <Box sx={{
      
      display: 'flex',
      alignItems: 'center',
    }}>
      <Rating
        id="wifiQuality"
        name="wifiQuality"
        
        icon={<Wifi color="primary" fontSize="inherit" />}
        emptyIcon={<Wifi  color="disabled" fontSize="inherit" />}
        getLabelText={getLabelText}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        value={value}
        onChange={handleInputChange}
      />
      {context === "popup" && (
      <Typography variant="body2" sx={{ ml: 2 }}>{wifiLabels[hover !== -1 ? hover : value]}</Typography>)}
    </Box>
  );
};

export default WifiRating;
export {wifiLabels}

