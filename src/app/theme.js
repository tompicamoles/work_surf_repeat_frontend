import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#05668D",
      light:"#089dd9"
      
    },
    secondary: {
      main: "#f0f3bd",
    },

    text: {
      secondary: "rgba(61,61,61,0.6)",
      disabled: "rgba(74,74,74,0.38)",
    },
  },
  typography: {
    fontFamily: "Ubuntu",
    h1: {
      fontSize: "4rem",
      fontWeight: 500,
    },
  },

  props: {
    MuiAppBar: {
      color: "transparent",
    },
  },
  components: {
    MuiStack: {
      styleOverrides: {
        // Apply border radius to the grid container
        root: {
          borderRadius: "16px",
        },
        // Optionally, apply border radius to grid items
      },
    },

    MuiGrid: {
      styleOverrides: {
        // Apply border radius to the grid container
        root: {
          borderRadius: "16px",
        },
        // Optionally, apply border radius to grid items
      },
    },
  

    MuiTooltip: {
      styleOverrides: {
        root: {
          bgcolor: "white",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          // Remove marginRight
          marginRight: "5px",
          marginLeft: "5px"
        },
      },
    },
  },
});
