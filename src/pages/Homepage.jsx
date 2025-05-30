import Spots from "../features/spots/components/Spots";
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Tab } from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";

import SpotCreationPopup from "../features/spots/components/SpotCreationPopup";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SearchPanel from "../common/components/SearchPanel";
import SideBar from "../common/components/SideBar";
import { SpotMap } from "../features/spots/components/SpotsMap";

function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filterButton, setFilterButton] = useState(false);
  const [value, setValue] = React.useState("list");

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const handleFilterButtonClick = () => {
    setFilterButton(filterButton ? false : true);
  };

  const spotSearch = searchParams.get("spot");

  useEffect(() => {
    if (spotSearch) {
      navigate({
        pathname: "/",
      });
    }
  }, []);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      p={2}
    >
      <Grid xs={12} item>
        <SearchPanel />
      </Grid>

      <Grid xs={12} item p={2}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleFilterButtonClick}
        >
          Filters
        </Button>
      </Grid>

      <Grid
        id="sidebar"
        xs={12}
        md={5}
        lg={3}
        item
        container
        p={2}
        sx={{
          display: filterButton
            ? "block"
            : {
                xs: "none",
                md: "block",
              },
        }}
      >
        <SideBar setFilterButton={setFilterButton} />
      </Grid>

      <Grid id="spots" xs={12} md={7} lg={9} item p={2} container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="list" value="list" />
                <Tab label="map" value="map" />
              </TabList>
              <SpotCreationPopup />
            </Box>
            <TabPanel sx={{ padding: 0.5 }} value="list">
              <Spots />
            </TabPanel>
            <TabPanel value="map">
              <SpotMap />{" "}
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
    </Grid>
  );
}

export default HomePage;
