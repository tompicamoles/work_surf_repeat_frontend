import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const DestinationSummary = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Check if text overflows beyond 3 lines
    if (textRef.current) {
      const element = textRef.current;
      // When text is clamped, scrollHeight > clientHeight means there's overflow
      setShowButton(element.scrollHeight > element.clientHeight);
    }
  }, [summary]);

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
          ref={textRef}
          variant="body1"
          sx={{
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "none" : 2,
            WebkitBoxOrient: "vertical",
            overflow: isExpanded ? "visible" : "hidden",
          }}
        >
          {summary}
        </Typography>

        {showButton && (
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
        )}
      </Box>
    </Grid>
  );
};

export default DestinationSummary;
