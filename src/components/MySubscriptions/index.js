import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Stack, Grid } from "@mui/material";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "src/firebase-config";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import ManageSubscriptonCard from "../ManageSubscriptionCard";
import PageTitle from "../PageTitle";
import PageTitleWrapper from "../PageTitleWrapper";

function MySubscriptions() {
  const { user } = useUserAuth();
  const [allSubscriptions, setAllSubscriptions] = useState();
  const [userSubscriptions, setUserSubscriptions] = useState();
  const [userSubscriptionsData, setUserSubscriptionsData] = useState();

  useEffect(() => {

    const getAllSubscriptions = async () => {
      const channelRef = collection(db, "channels");
      const q = query(channelRef);
      const unsub =  onSnapshot(q, (snapshot) => {
        let channels = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          data["channelId"] = doc.id;
          channels.push(data);
        });
        setAllSubscriptions(channels);
        console.log("userchannels", channels);
      });
    };
  
    const getUserSubscriptions = async () => {
      const ref = collection(db, "users", user.uid, "subscriptions");
      const unsub = onSnapshot(query(ref), (snapshot) => {
      let userSubs = [];
      let userSubData = {};
      snapshot.forEach((doc) => {
        let sub = doc.data();
        userSubs.push(doc.id);
        userSubData[doc.id] = sub
      });
      setUserSubscriptions(userSubs);
      setUserSubscriptionsData(userSubData);
      });
    }

    getAllSubscriptions();
    getUserSubscriptions();
  }, []);

  return (
    <Box p={2} alignItems="center">
      <PageTitleWrapper>
        <PageTitle
          heading="My Subscriptions"
          subHeading="All the channels you are currently subscribed"
        />
      </PageTitleWrapper>

      <Grid container spacing={3}>
        {allSubscriptions && userSubscriptions &&
          allSubscriptions.map((channel, index) => (
          (userSubscriptions.indexOf(channel.channelId) > -1) && 
            <Grid item xs={12}>
              <ManageSubscriptonCard
                channel={channel}
                userSubs={userSubscriptions}
                userSubData={userSubscriptionsData}
                key={index}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

export default MySubscriptions;
