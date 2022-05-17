import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Grid,
} from "@mui/material";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import { db } from "src/firebase-config";
import {
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default function SubscribeDialog({
  channel,
  open,
  handleClose,
  setLoading,
  setAlert,
  setAlertInfo,
  previousState,
}) {
  const { user } = useUserAuth();
  console.log("previousState", previousState);
  // State Variables
  let initialState;
  if (previousState) {
    initialState = previousState;
  } else {
    initialState = {
      personalized: true,
      broadcast: true,
      onchain: true,
      endpoint: null
    };
  }
  const [state, setState] = React.useState(initialState);

  const updateUserSubscriptions = async () => {
    const ref = doc(db, "users", user.uid, "subscriptions", channel.channelId);
    await setDoc(ref, state);
  };

  const updateChannelSubscribers = async () => {
    const ref = doc(db, "channels", channel.channelId, "subscribers", user.uid);
    await setDoc(ref, state);
    const channelRef = doc(db, "channels", channel.channelId);
    let increments = [];
    ["personalized", "broadcast", "onchain"].forEach((item) => {
      if (previousState) {
        let oldState = previousState[item] ? 1 : 0;
        let newState = state[item] ? 1 : 0;
        increments.push(newState - oldState);
      } else {
        increments.push(state[item] ? 1 : 0);
      }
    });
    await updateDoc(channelRef, {
      "subscriberCount.personalized": increment(increments[0]),
      "subscriberCount.broadcast": increment(increments[1]),
      "subscriberCount.onchain": increment(increments[2]),
    });
  };

  const deleteUserSubscriptions = async () => {
    const ref = doc(db, "users", user.uid, "subscriptions", channel.channelId);
    await deleteDoc(ref);
  };

  const deleteChannelSubscribers = async () => {
    const ref = doc(db, "channels", channel.channelId, "subscribers", user.uid);
    await deleteDoc(ref);
    const channelRef = doc(db, "channels", channel.channelId);
    await updateDoc(channelRef, {
      "subscriberCount.personalized": previousState.personalized
        ? increment(-1)
        : increment(0),
      "subscriberCount.broadcast": previousState.broadcast
        ? increment(-1)
        : increment(0),
      "subscriberCount.onchain": previousState.onchain
        ? increment(-1)
        : increment(0),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (Object.values(state).every((value) => !value)) {
      setAlertInfo({
        message: "Must select atleast one message type to subscribe.",
        severity: "error",
      });
      setAlert(true);
    } else {
      await updateUserSubscriptions();
      await updateChannelSubscribers();
      setAlertInfo({
        message: "Subscribed Successfully.",
        severity: "success",
      });
      setAlert(true);
      handleClose();
    }
    setLoading(false);
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    await deleteUserSubscriptions();
    await deleteChannelSubscribers();
    setAlertInfo({
      message: "UnSubscribed Successfully.",
      severity: "success",
    });
    setAlert(true);
    handleClose();
    setLoading(false);
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const handleEndpointChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select all the types of notification that you would like to
            receive from {channel.displayName}
          </DialogContentText>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend"></FormLabel>
            <FormGroup>
              <Grid container spacing={3} padding={2}>
                {channel.personalizedMessages && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.personalized}
                          onChange={handleChange}
                          name="personalized"
                        />
                      }
                      label="Personalized messages"
                    />
                  </Grid>
                )}
                {channel.broadcastMessages && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.broadcast}
                          onChange={handleChange}
                          name="broadcast"
                        />
                      }
                      label="Broadcast Messages"
                    />
                  </Grid>
                )}
                {channel.onchainMessages && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={state.onchain}
                          onChange={handleChange}
                          name="onchain"
                        />
                      }
                      label="Onchain Messages"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    required
                    id="endpoint"
                    name="endpoint"
                    label="Receiver Endpoint(POST)"
                    value={state.endpoint ?? " "}
                    onChange={handleEndpointChange}
                    fullWidth
                    variant="outlined"
                  />
                  </Grid>
              </Grid>
            </FormGroup>
            <FormHelperText>You can select multiple</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {previousState ? "Edit Subscription" : "Subscribe"}
          </Button>
          {previousState && (
            <Button onClick={handleUnsubscribe}> Unsubscribe </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
