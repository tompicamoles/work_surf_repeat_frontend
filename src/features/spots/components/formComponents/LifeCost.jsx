import { Rating, Box, Typography } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";
import { useState } from "react";

const lifeCostLabels = {
  1: "Very cheap",
  2: "Cheap",
  3: "Average",
  4: "Expensive",
  5: "Very expensive",
};

const LifeCost = ({ value, handleInputChange, context }) => {
  const [hover, setHover] = useState(-1);

  function getLabelText(value) {
    return ` ${lifeCostLabels[value]}`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Rating
        id="lifeCost"
        name="lifeCost"
        icon={<AttachMoney color="primary" fontSize="inherit" />}
        emptyIcon={<AttachMoney color="disabled" fontSize="inherit" />}
        getLabelText={getLabelText}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        value={value}
        onChange={handleInputChange}
      />
      {context === "popup" && (
        <Typography variant="body2" sx={{ ml: 2 }}>
          {lifeCostLabels[hover !== -1 ? hover : value]}
        </Typography>
      )}
    </Box>
  );
};

export default LifeCost;
export { lifeCostLabels };
