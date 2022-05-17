import React, { useEffect, useState } from "react";
import { storage, db } from "src/firebase-config";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import { useUserMessages } from "src/contexts/MessagesContextProvider";
import { Box } from "@mui/system";
import {
  Badge,
  Card,
  Grid,
  Typography,
  Avatar,
  styled,
  Dialog,
  Button,
} from "@mui/material";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import ShowMessageDialog from "../ShowMessageDialog";
const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function InboxMessages({ type }) {
  const { user } = useUserAuth();
  const [messages, setMessages] = useState();
  const { userMessages, unreadMsgCount } = useUserMessages();
  const [openMessageDialog, setOpenMessageDialog] = React.useState(false);
  const getTimeStamp = (ts) => {
    let date = new Date(ts.seconds * 1000).toLocaleDateString("en-US");
    let today = new Date().toLocaleDateString("en-us");
    if (date !== today) {
      return date;
    } else {
      return new Date(ts.seconds * 1000).toLocaleTimeString("en-US");
    }
  };
  let msgs = [];
  if (userMessages) {
    msgs = userMessages.filter((msg) => msg.messageType === type);
  }
  const handleMarkRead = async(msgId) => {
    const ref = doc(db, "users", user.uid, "inbox", msgId);
    // Set the "capital" field of the city 'DC'
    await updateDoc(ref, {
      readTime: serverTimestamp()
  });
  }
  const handleMarkSpam = async(msgId) => {
    const ref = doc(db, "users", user.uid, "inbox", msgId);
    // Set the "capital" field of the city 'DC'
    await updateDoc(ref, {
      spam: true
  });
  }
  const handleClick = () => {
    setOpenMessageDialog(!openMessageDialog);
  };

  const handleClose = () => {
    setOpenMessageDialog(false);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {msgs &&
          msgs.map((msg, index) => (
            <>
            <Card sx={{ p: 0.5 }} key={index}>
              <Box
                p={0.5}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flex={2}>
                  <Badge color="secondary" variant="dot" invisible={msg.readTime}>
                    <AvatarWrapper alt={msg.sender} src={msg.logoPath} />
                  </Badge>
                </Box>
                <Box flex={4} onClick={() => handleClick(msg)}>
                  <Typography variant="h4" gutterBottom>
                    {msg.channelName}
                  </Typography>
                </Box>
                <Box flex={8} onClick={() => handleClick(msg)}>
                  <Typography variant="subtitle2">{msg.message}</Typography>
                </Box>
                <Box flex={2}>
                  <Typography variant="subtitle2">
                    {getTimeStamp(msg.sentTime)}
                  </Typography>
                </Box>
                <Box flex={3}>
                  {/* <Box flex={1}> */}
                    {!msg.readTime ? <Button onClick={() => handleMarkRead(msg.id)}>Mark Read</Button> : <Button disabled>Read</Button>}
                  {/* </Box> */}
                  {/* <Box flex={1}> */}
                    {!msg.spam ? <Button onClick={() => handleMarkSpam(msg.id)}>Mark spam</Button> : <Button disabled>Marked Spam</Button>}
                  {/* </Box> */}
                </Box>
              </Box>
            </Card>
            <ShowMessageDialog
            msg={msg}
            open={openMessageDialog}
            handleClose={handleClick}
          />
          </>
          ))}
      </Grid>
    </Grid>
  );
}

export default InboxMessages;
