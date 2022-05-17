import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Grid } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import ManageChannelCard from "src/components/ManageChannelCard";
import { storage, db } from "src/firebase-config";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";

function UserSubscriptions() {
  const { user } = useUserAuth();
  const [allSubscriptions, setAllSubscriptions] = useState();

  useEffect(() => {
    const getAllSubscriptions = async () => {
      const channelRef = collection(db, "channels");
      const q = query(channelRef);
      const snapshot = await getDocs(q);
      let channels = [];
      snapshot.forEach((doc) => {
        channels.push(doc.data());
      });
      setAllSubscriptions(channels);
      console.log("userchannels", channels);
    };
    getAllSubscriptions();
  }, []);

  return (
    <Box p={2} alignItems="center">
      <Typography variant="h1">User Subscriptions</Typography>
      
      <Grid container spacing={3}>

        {allSubscriptions &&
          allSubscriptions.map((channel) => (
              <Grid item xs={12}>
              <ManageChannelCard channel={channel}/>
              </Grid>
      
          ))}
      </Grid>
    </Box>
  );
}

export default UserSubscriptions;
