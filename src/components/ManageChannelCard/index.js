import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";
import logo from "src/hns-logo.png";
import {
  Avatar,
  CardHeader,
  Grid,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AssignmentTurnedInTwoToneIcon from "@mui/icons-material/AssignmentTurnedInTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Text from "src/components/Text";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CellTowerIcon from "@mui/icons-material/CellTower";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import SendNotificationDialog from "src/components/SendNotificationDialog";

const RootWrapper = styled(Card)(
  ({ theme }) => `
    background: ${theme.colors.gradients.green1};
    color: ${theme.colors.alpha.white[100]};
    
    .MuiCardHeader-title {
      color: ${theme.colors.alpha.white[100]};
    }
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
);

export default function ManageChannelCard({ channel }) {
  const theme = useTheme();
  const [openSendNotificationDialog, setOpenSendNotificationDialog] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ info: null, severity: null });

  const handleClickOpen = () => {
    setOpenSendNotificationDialog(true);
  };

  const handleClose = () => {
    setOpenSendNotificationDialog(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(null);
  };

  const displayItems = [
    ["Channel Name", channel.channelName],
    // ["Display Name", channel.displayName],
    // ["Channel Desciption", channel.description],
    ["Created By", channel.createdBy],
    [
      "Created At",
      new Date(channel.createdAt.seconds * 1000).toLocaleDateString("en-US"),
    ],
    ["Broadcast Messages", channel.broadcastMessages ? "Enabled" : "Disabled"],
    [
      "Personalized Messages",
      channel.personalizedMessages ? "Enabled" : "Disabled",
    ],
    ["Onchain Messages", channel.onchainMessages ? "Enabled" : "Disabled"],
    ["Onchain Smart Contract Address", channel.smartContractAddress],
  ];
  return (
    <Card>
      <Box
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex={1}>
          <AvatarWrapper alt={channel.displayName} src={channel.logoPath} />
        </Box>
        <Box flex={8}>
          <Typography variant="h4" gutterBottom>
            {channel.displayName}
          </Typography>
          <Typography variant="subtitle2">{channel.description}</Typography>
        </Box>
        <Button variant="text" disabled startIcon={<EditTwoToneIcon />}>
          Edit
        </Button>
        <Button
          variant="outlined"
          startIcon={<SendTwoToneIcon />}
          onClick={handleClickOpen}
        >
          Send Notification
        </Button>
      </Box>
      <Divider />
      <Box
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex={6}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                {displayItems.map((item, i) => (
                  <React.Fragment key={i}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {item[0]}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{item[1]}</b>
                      </Text>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Typography>
          </CardContent>
        </Box>
        <Box flex={3}>
          <RootWrapper sx={{ p: 1 }}>
            <CardHeader
              title="Subscriber Count"
              titleTypographyProps={{ variant: "h3" }}
            />
            <CardContent>
              <Box display="flex" sx={{ px: 2, pb: 3 }} alignItems="center">
                <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                  <AccountBoxIcon fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h1">
                    {channel.personalizedMessages
                      ? channel.subscriberCount.personalized
                      : "-"}
                  </Typography>
                  <TypographySecondary variant="subtitle2" noWrap>
                    For Personalized Messages
                  </TypographySecondary>
                </Box>
              </Box>
              <Box display="flex" sx={{ px: 2, pb: 3 }} alignItems="center">
                <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                  <CellTowerIcon fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h1">
                    {channel.broadcastMessages
                      ? channel.subscriberCount.broadcast
                      : "-"}
                  </Typography>
                  <TypographySecondary variant="subtitle2" noWrap>
                    For Broadcast Messages
                  </TypographySecondary>
                </Box>
              </Box>
              <Box display="flex" sx={{ px: 2, pb: 3 }} alignItems="center">
                <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                  <AccountTreeTwoToneIcon fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h1">
                    {channel.onchainMessages
                      ? channel.subscriberCount.onchain
                      : "-"}
                  </Typography>
                  <TypographySecondary variant="subtitle2" noWrap>
                    For Onchain Messages
                  </TypographySecondary>
                </Box>
              </Box>
            </CardContent>
          </RootWrapper>
        </Box>
      </Box>
      <SendNotificationDialog
        open={openSendNotificationDialog}
        handleClose={handleClose}
        channel={channel}
        setLoading={setLoading}
        setAlert={setAlert}
        setAlertInfo={setAlertInfo}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={alert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
