import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CellTowerIcon from "@mui/icons-material/CellTower";
import { Link, Outlet, useLocation } from "react-router-dom";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import WebNotification from "src/components/WebNotification";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function Inbox() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const routes = ["/inbox/personalized", "/inbox/onchain", "/inbox/broadcast"];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const location = useLocation();
  console.log("Location", location);
  return (
    <Box flex={4} p={2} alignItems="center">
      {/* <AppBar position="static"> */}
      <Tabs
        value={location.pathname}
        onChange={handleChange}
        // TabIndicatorProps={{ style: { backgroundColor: "#D97D54" } }}
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab
          value={routes[0]}
          component={Link}
          to={routes[0]}
          label={
            <div>
              <AccountBoxIcon
                style={{ verticalAlign: "middle", paddingRight: "10px" }}
              />
              Personal Messages
            </div>
          }
          {...a11yProps(0)}
        />
        <Tab
          value={routes[1]}
          component={Link}
          to={routes[1]}
          label={
            <div>
              <AccountTreeTwoToneIcon
                style={{ verticalAlign: "middle", paddingRight: "10px" }}
              />
              Onchain Messages
            </div>
          }
          {...a11yProps(1)}
        />
        <Tab
          value={routes[2]}
          component={Link}
          to={routes[2]}
          label={
            <div>
              <CellTowerIcon
                style={{ verticalAlign: "middle", paddingRight: "10px" }}
              />
              Broadcast Messages
            </div>
          }
          {...a11yProps(2)}
        />
      </Tabs>
      <Box marginTop={2}>
      <Outlet />
      </Box>
      <WebNotification />
    </Box>
  );
}

export default Inbox;
