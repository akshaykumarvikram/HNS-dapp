import { Card, Box, Badge, styled, Typography, Avatar } from "@mui/material";
import React from "react";
import { onMessageListener } from "src/firebase-config";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

onMessageListener().then((payload) => {
  const notif = (
    <Card sx={{ p: 2.5 }}>
      <Box display="flex" alignItems="center" pb={3}>
        <AvatarWrapper
          alt="Remy Sharp"
          src="/static/images/logo/hns-logo.jpeg"
        />
        <Box sx={{ ml: 1.5 }}>
          <Typography variant="h4" noWrap gutterBottom>
            {payload.notification.title}
          </Typography>
          <Typography variant="subtitle2">
            {payload.notification.body}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
  toast(notif);
});

export default function WebNotification() {
  return (
    <ToastContainer style={{ width: "25vw" }} />
  );
}
