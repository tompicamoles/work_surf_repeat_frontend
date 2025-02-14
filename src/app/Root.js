import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import { Stack } from "@mui/material";

function Root() {
  return (
    <Stack
      id="rootComponent"
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <Navbar />
      <Outlet />
    </Stack>
  );
}

export default Root;
