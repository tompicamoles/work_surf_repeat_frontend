import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import NavBar from "../common/components/NavBar";

function Root() {
  return (
    <Stack
      id="rootComponent"
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <NavBar />
      <Outlet />
    </Stack>
  );
}

export default Root;
