import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";

const DestinationSummary = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Grid item xs={12} sx={{ my: 3 }}>
      <Box
        sx={{
          backgroundColor: "grey.50",
          padding: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            color: "text.primary",
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: isExpanded ? "visible" : "hidden",
            transition: "all 0.3s ease",
          }}
        >
          {summary}
        </Typography>

        <Button
          variant="text"
          onClick={toggleExpanded}
          startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{
            mt: 1,
            p: 0,
            minHeight: "auto",
            textTransform: "none",
            color: "primary.main",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "transparent",
              color: "primary.dark",
            },
          }}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </Box>
    </Grid>
  );
};

export default DestinationSummary;
