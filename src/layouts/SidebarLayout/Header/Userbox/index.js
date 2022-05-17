import { useRef, useState } from "react";

import { NavLink } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";


import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import InboxTwoToneIcon from "@mui/icons-material/InboxTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import SubscriptionsTwoToneIcon from '@mui/icons-material/SubscriptionsTwoTone';
import PodcastsTwoToneIcon from '@mui/icons-material/PodcastsTwoTone';
import { useUserAuth } from "src/contexts/UserAuthContextProvider";

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  // const users = {
  //   name: "0.0.31415926",
  //   avatar: "/static/images/avatars/1.png",
  //   jobtitle: "Test Network",
  // };
  const avatar = "/static/images/avatars/1.png";
  const network = "Test Network";
  const { user } = useUserAuth();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user.uid} src={avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.uid}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {network}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user.uid} src={avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.uid}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {network}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem button to="/inbox" component={NavLink}>
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Inbox" />
          </ListItem>
          <ListItem button to="/subscriptions/allsubscriptions" component={NavLink}>
            <SubscriptionsTwoToneIcon fontSize="small" />
            <ListItemText primary="My Subscriptions" />
          </ListItem>
          <ListItem button to="/channels/manage" component={NavLink}>
            <PodcastsTwoToneIcon fontSize="small" />
            <ListItemText primary="My Channels" />
          </ListItem>
          <ListItem
            button
            to="/login"
            component={NavLink}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary="Manage Account" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
