import { Box, Tooltip, Typography } from "@mui/material";
import { FaSnowman, FaSun } from "react-icons/fa";
import { GiMapleLeaf, GiSprout } from "react-icons/gi";

const SurfSeasonIcons = ({ surfSeason }) => {
  const seasonIcons = [
    {
      icon: FaSun,
      label: "Summer",
      months: ["6", "7", "8", "All year round"],
    },
    {
      icon: GiMapleLeaf,
      label: "Autumn",
      months: ["9", "10", "11", "All year round"],
    },
    {
      icon: FaSnowman,
      label: "Winter",
      months: ["12", "1", "2", "All year round"],
    },
    {
      icon: GiSprout,
      label: "Spring",
      months: ["3", "4", "5", "All year round"],
    },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: "white",
          fontWeight: 600,
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
          mr: 1,
        }}
      >
        Best Surf Season:
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {seasonIcons.map(({ icon: Icon, label, months }, index) => {
          const isActive = surfSeason.some((month) => months.includes(month));
          return (
            <Tooltip key={index} title={label} arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Icon
                  size={16}
                  color={isActive ? "#05668D" : "rgba(74,74,74,0.38)"}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default SurfSeasonIcons;
