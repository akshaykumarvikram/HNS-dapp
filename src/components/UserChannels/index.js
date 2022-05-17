import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Grid } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import ManageChannelCard from "src/components/ManageChannelCard";
import { storage, db } from "src/firebase-config";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";

function UserChannels() {
  const { user } = useUserAuth();
  const [userChannels, setUserChannels] = useState();

  useEffect(() => {
    const getUserChannels = async () => {
      const channelRef = collection(db, "channels");
      const q = query(channelRef, where("createdBy", "==", user.uid));
      const snapshot = await getDocs(q);
      let channels = [];
      snapshot.forEach((doc) => {
        let channel = doc.data();
        channel["id"] = doc.id;
        channels.push(channel);
      });
      setUserChannels(channels);
      console.log("userchannels", channels);
    };
    getUserChannels();
  }, []);

  return (
    <Box p={2} alignItems="center">
      <Typography variant="h1">Channels</Typography>
      
      <Grid container spacing={3}>

        {userChannels &&
          userChannels.map((channel) => (
              <Grid item xs={12} key={channel.id}>
              <ManageChannelCard channel={channel} key={channel.id}/>
              </Grid>
      
          ))}
      </Grid>
    </Box>
  );
}

export default UserChannels;
