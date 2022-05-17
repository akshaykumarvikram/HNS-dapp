import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useHashConnect } from "src/contexts/HashconnectProvider";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import logo from "src/hns-logo.png";
import axios from "axios";
import { requestFirebaseNotificationPermission } from "src/firebase-config";

function AccountManagement() {
  const {
    pairWallet,
    unPairWallet,
    getAuthToken,
    walletData,
    installedExtensions,
  } = useHashConnect();
  const { accountIds } = walletData;
  const { user, login, logout } = useUserAuth();
  const navigate = useNavigate();
  const conCatAccounts = (lastAccs, Acc) => {
    return lastAccs + " " + Acc;
  };
  const signin = async () => {
    try {
      let customToken = await getAuthToken();
      await login(customToken);
      navigate("/inbox");
    } catch (e) {
      console.log(e);
    }
  };
  const signout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };
  const handleUnpair = () => {
    unPairWallet();
    if (user) {
      signout();
    }
  };
  const handleEnableNotification = () => {
    const endpoint =
      "https://us-central1-hedera-notification-service.cloudfunctions.net/expressApi";
    requestFirebaseNotificationPermission()
      .then((fcmToken) => {
        console.log("FCM Token: ", fcmToken);
        axios
          .post(
            `${endpoint}/fcmToken`,
            { account_id:user.uid, fcmToken:fcmToken },
            { headers: { "Content-Type": "application/json" } }
          )
          .catch((error) =>
            console.error("Unable to send FCM token to backend. Error:", error)
          );
      })
      .catch((error) =>
        console.error(`Notification permission request error: ${error}`)
      );
  };
  let walletConnected = accountIds && accountIds?.length > 0;
  let account = accountIds?.reduce(conCatAccounts);
  let installExtensionsMessage = (
    <Typography variant="h4" component="h2">
      Please install HashPack extension to continue
    </Typography>
  );
  let login_form = (
    <Stack
      spacing={2}
      direction="column"
      justifyContent="center"
      alignItems="stretch"
    >
      {walletConnected ? (
        <>
          <Typography variant="body1" component="p">
            {" "}
            Wallet connected to {account} account on test network.
          </Typography>
          <Button variant="contained" onClick={handleUnpair}>
            {" "}
            Unpair Wallet
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={pairWallet}>
          Pair Wallet
        </Button>
      )}
      {walletConnected &&
        (user ? (
          <>
            <Button variant="contained" onClick={signout}>
              Log out
            </Button>
            <Button variant="contained" onClick={handleEnableNotification}>
              Enable Notifications
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={signin}>
            Log In
          </Button>
        ))}
    </Stack>
  );
  return (
    <Box flex={4} p={2} alignItems="center" justifyContent="center">
      <Stack
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={3}
      >
        {/* <Typography variant="h6">Hedera Notification Service Login</Typography> */}

        <Box
          component="img"
          sx={{
            height: 256,
          }}
          alt="HNS"
          src={logo}
        />
        {user ? (
          <Typography variant="h6" component="p">
            Logged in
          </Typography>
        ) : (
          <Typography variant="h6" component="p">
            Login
          </Typography>
        )}
        {installedExtensions ? login_form : installExtensionsMessage}
      </Stack>
      <Outlet />
    </Box>
  );
}

export default AccountManagement;
