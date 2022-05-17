import React, { useEffect, useState } from "react";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import { db } from "src/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Grid,
  Backdrop,
  CircularProgress
} from "@mui/material";

import axios from "axios";

export default function SendNotificationDialog({
  channel,
  open,
  handleClose,
  setAlert,
  setAlertInfo,
}) {
  const { user } = useUserAuth();
  const [subs, setSubs] = useState([]);
  const [messageType, setMessageType] = useState();
  const [subscriber, setSubscriber] = useState();
  const [message, setMessage] = useState();
  const messageTypes = ["Personalized", "Broadcast"];
  const [loading, setLoading] = useState(false);

  const handleMsgTypeChange = (event) => {
    setMessageType(event.target.value);
  };
  const handleMsgChange = (event) => {
    setMessage(event.target.value);
  };
  const handleSubChange = (event) => {
    setSubscriber(event.target.value);
  };

  const sendMessage = async () => {
    let endpoint =
      "https://us-central1-hedera-notification-service.cloudfunctions.net/expressApi";
    // endpoint =
    //   "http://localhost:5001/hedera-notification-service/us-central1/expressApi";
    let response = await axios({
      method: "POST",
      url: `${endpoint}/message`,
      data: {
        sender: channel.id,
        receiver: subscriber,
        messageType: messageType,
        message: message,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  const handleSubmit = async () => {
    if (!messageType) {
      setAlertInfo({
        message: "Please select a messsage type",
        severity: "error",
      });
      setAlert(true);
    }
    if (messageType == "Personalized" && !subscriber) {
      setAlertInfo({
        message: "Please select a subscriber",
        severity: "error",
      });
      setAlert(true);
    }
    if (!message) {
      setAlertInfo({
        message: "Please add a message",
        severity: "error",
      });
      setAlert(true);
    }
    setLoading(true);
    try {
      const response = await sendMessage();
      if (response.status == 200) {
        setAlertInfo({
          message: "Message sent successfully",
          severity: "success",
        });
        setAlert(true);
        setMessageType(null);
        setMessage(null);
        setSubscriber(null);
        handleClose();
      } else {
        setAlertInfo({
          message: `Response status: ${response.status}`,
          severity: "error",
        });
        setAlert(true);
      }
    } catch (err) {
      setAlertInfo({
        message: `Encountered an error. Status: ${err.response.status}, Message: ${err.message}`,
      });
      setAlert(true);
    }
    setLoading(false)
  };

  useEffect(() => {
    const getSubs = () => {
      const subRef = collection(db, "channels", channel.id, "subscribers");
      const q = query(subRef, where("personalized", "==", true));
      const unsub = onSnapshot(q, (snapshot) => {
        let subs = [];
        snapshot.forEach((doc) => {
          subs.push(doc.id);
        });
        setSubs(subs);
      });
    };
    getSubs();
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send Notification</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Select the message Type</DialogContentText> */}
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <Grid container spacing={3} padding={2}>
              <Grid item xs={12} key="message-type">
                <FormControl fullWidth>
                  <InputLabel id="message-type">Select Message Type</InputLabel>
                  <Select
                    required
                    labelId="message-type"
                    id="demo-simple-select"
                    value={messageType ?? " "}
                    label="Message Type"
                    onChange={handleMsgTypeChange}
                  >
                    {messageTypes.map((value, index) => {
                      return <MenuItem value={value} key={index}>{value}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {messageType === "Personalized" && (
                <Grid item xs={12} key="select-subscriber">
                  <FormControl fullWidth>
                    <InputLabel id="select-subscriber">
                      Select Subscriber
                    </InputLabel>
                    <Select
                      required
                      labelId="select-subscriber"
                      id="select-subscriber"
                      value={subscriber ?? " "}
                      label="Subscriber"
                      onChange={handleSubChange}
                    >
                      {subs.map((value, index) => {
                        return (
                          <MenuItem value={value} key={index}>
                            {value}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} key="message">
                <TextField
                  required
                  id="message"
                  name="message"
                  label="message"
                  value={message ?? " "}
                  onChange={handleMsgChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Send Notification</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
