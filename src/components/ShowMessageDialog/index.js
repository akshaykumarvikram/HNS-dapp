import {
  Card,
  Dialog,
  styled,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
  Divider,
  CardContent,
} from "@mui/material";
import React from "react";

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

export default function ShowMessageDialog({ msg, open, handleClose }) {
  const getTimeStamp = (ts) => {
    const date = new Date(ts.seconds * 1000).toLocaleDateString("en-US");
    const time = new Date(ts.seconds * 1000).toLocaleTimeString("en-US");
    return `${date} - ${time}`;
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
      <Card>
        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flex={1}>
            <AvatarWrapper alt={msg.channelName} src={msg.logoPath} />
          </Box>
          <Box flex={8}>
            <Typography variant="h4" gutterBottom>
              {msg.channelName}
            </Typography>
          </Box>
          <Box flex={2}>
            <Typography variant="h6" gutterBottom>
              {getTimeStamp(msg.sentTime)}
            </Typography>
          </Box>
        </Box>
        {/* <Divider /> */}
        <Box flex={12}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {msg.message}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
