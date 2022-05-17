import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { requestFirebaseNotificationPermission } from "../firebase-config";

const INITIAL_SAVE_DATA = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
};

let APP_CONFIG = {
  name: "Hedera Notification Service",
  description: "Hedera Notification Service DApp",
  icon: "https://absolute.url/to/icon.png",
};

const loadLocalData = () => {
  let foundData = localStorage.getItem("hashconnectData");

  if (foundData) {
    const saveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};

const loadExtensionData = () => {
  let foundData = localStorage.getItem("hashconnectExtensions");
  if (foundData) {
    return JSON.parse(foundData);
  } else return null;
};

export const HashConnectContext = createContext();

function HashconnectProvider({
  children,
  hashConnect,
  metaData,
  netWork,
  debug,
}) {
  // Setup state
  const [saveData, SetSaveData] = useState(INITIAL_SAVE_DATA);
  const [installedExtensions, setInstalledExtensions] = useState(null);
  // initialize hash connect
  const initializeHashConnect = async () => {
    const saveData = INITIAL_SAVE_DATA;
    const localData = loadLocalData();
    const localExtensionData = loadExtensionData();
    try {
      if (!localData || localData === INITIAL_SAVE_DATA) {
        if (debug) console.log("===Local data not found.=====");
        //first init and store the private for later
        let initData = await hashConnect.init(metaData ?? APP_CONFIG);
        saveData.privateKey = initData.privKey;
        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        saveData.topic = state.topic;
        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(
          state,
          netWork,
          debug ?? false
        );
        //find any supported local wallets
        hashConnect.findLocalWallets();
      } else {
        if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        await hashConnect.init(metaData ?? APP_CONFIG, localData.privateKey);
        await hashConnect.connect(
          localData.topic,
          localData.pairedWalletData ?? metaData
        );
        if (debug) console.log("====Local extensions data found====", localExtensionData);
        setInstalledExtensions(localExtensionData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (localData) {
        SetSaveData((prevData) => ({ ...prevData, ...localData }));
      } else {
        SetSaveData((prevData) => ({ ...prevData, ...saveData }));
      }
      if (debug) console.log("====Wallet details updated to state====");
    }
  };

  const saveDataInLocalStorage = (data) => {
    if (debug)
      console.info(
        "===============Saving to localstorage::=============",
        data
      );
    const { metadata, accountIds, id, ...restData } = data;
    SetSaveData((prevSaveData) => {
      prevSaveData.pairedWalletData = metadata;
      prevSaveData.accountIds = accountIds;
      prevSaveData.id = id;
      return { ...prevSaveData, ...restData };
    });
  };

  const foundExtensionEventHandler = (data) => {
    if (debug) console.info("====foundExtensionEvent====", data);
    // Do a thing
    setInstalledExtensions(data);
  };

  const pairingEventHandler = (data) => {
    if (debug) console.log("====pairingEvent:::Wallet connected=====", data);
    // Save Data to localStorage
    saveDataInLocalStorage(data);
  };

  useEffect(() => {
    //Intialize the setup
    initializeHashConnect();

    // Attach event handlers
    hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);

    return () => {
      // Detach existing handlers
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
    };
  }, []);

  useEffect(() => {
    if (saveData !== INITIAL_SAVE_DATA) {
      console.info("=====Save Data Before Storing======", saveData);
      let dataToSave = JSON.stringify(saveData);
      localStorage.setItem("hashconnectData", dataToSave);
    //   let hashconnectExtensions = JSON.stringify(installedExtensions);
    //   localStorage.setItem("hashconnectExtensions", hashconnectExtensions);
    }
  }, [saveData]);

  useEffect(() => {
    if (installedExtensions !== null){
      console.info("=====Save installedExtensions Before Storing======", installedExtensions);
      let hashconnectExtensions = JSON.stringify(installedExtensions);
      localStorage.setItem("hashconnectExtensions", hashconnectExtensions);
    }
  }, [installedExtensions])

  const pairWallet = () => {
    if (installedExtensions) {
      if (debug) console.log("Pairing String::", saveData.pairingString);
      hashConnect.connectToLocalWallet(saveData?.pairingString);
    } else {
      if (debug) console.log("====No Extension is not in browser====");
      return "wallet not installed";
    }
  };

  const unPairWallet = () => {
    SetSaveData(INITIAL_SAVE_DATA);
    localStorage.removeItem("hashconnectData");
    window.location.reload();
  };

  const getAuthToken = async () => {
    if (saveData.accountIds) {
      try {
        // Get a nounce to sign from backend for the given account.
        let endpoint =
          "https://us-central1-hedera-notification-service.cloudfunctions.net/expressApi";
        // endpoint =
        //   "http://localhost:5001/hedera-notification-service/us-central1/expressApi";
        let response = await axios({
          method: "POST",
          url: `${endpoint}/authNounce`,
          data: {
            accountid: saveData.accountIds[0],
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (debug)
          console.log("==== fetch Signed Nounce Successful ====", response);
        // Sign transaction using hashconnect authenticate
        let topic = saveData.topic;
        let account_id = saveData.accountIds[0];
        let server_signing_account =
          response.data.signed_nounce.serverSigningAccount;
        let server_signature = response.data.signed_nounce.signature;
        console.log(typeof response.data.signed_nounce.signature);
        let server_signature_bytes = Uint8Array.from(
          atob(server_signature),
          (c) => c.charCodeAt(0)
        );
        console.log("Server Signature Length", server_signature_bytes.length);
        let payload = response.data.payload;
        let dat = {
          topic,
          account_id,
          server_signing_account,
          server_signature,
          server_signature_bytes,
          payload,
        };
        console.log("==== Before Dat hashconnect.authenticate() ====", dat);
        try {
          let authres = await hashConnect.authenticate(
            topic,
            account_id,
            server_signing_account,
            server_signature_bytes,
            payload
          );
          if (!authres.success) {
            console.error(authres);
          }
          console.log("authres first", authres);
          // Convert signatures into base64
          if (authres.signedPayload && authres.userSignature) {
            authres.signedPayload.serverSignature = btoa(
              String.fromCharCode(
                ...new Uint8Array(authres.signedPayload.serverSignature)
              )
            );
            authres.userSignature = btoa(
              String.fromCharCode(...new Uint8Array(authres.userSignature))
            );
          }
          console.log("authres second", authres);
          // console.log("Server Signature Length after authenticate", authres.signed_payload.serverSignature)
          // Send the response to backend to verify auth signature and get Firebase token if successfull
          let verifyRes = await axios({
            method: "POST",
            url: `${endpoint}/verifyAuthSignature`,
            data: { account_id, authres },
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("verifyRes: ", verifyRes.data);
          const firebaseAuthToken = verifyRes.data.token;
          const fcm_token = verifyRes.data?.fcmToken;
          console.log(
            `FCM token received from db: ${fcm_token} for account_id: ${account_id}`
          );
          if (!fcm_token) {
            requestFirebaseNotificationPermission()
              .then((fcmToken) => {
                console.log("FCM Token: ", fcmToken);
                axios
                  .post(
                    `${endpoint}/fcmToken`,
                    { account_id, fcmToken },
                    { headers: { "Content-Type": "application/json" } }
                  )
                  .catch((error) =>
                    console.error(
                      "Unable to send FCM token to backend. Error:",
                      error
                    )
                  );
              })
              .catch((error) =>
                console.error(`Notification permission request error: ${error}`)
              );
          }
          return firebaseAuthToken;
        } catch (err) {
          console.error("Authenticate Error: ", err);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      return "Wallet not connected";
    }
  };

  return (
    <HashConnectContext.Provider
      value={{
        pairWallet,
        unPairWallet,
        getAuthToken,
        walletData: saveData,
        netWork,
        installedExtensions,
      }}
    >
      {children}
    </HashConnectContext.Provider>
  );
}

const defaultProps = {
  metaData: {
    name: "Hedera Notification Service",
    description: "Hedera Notification Service DApp",
    icon: "https://absolute.url/to/icon.png",
  },
  netWork: "testnet",
  debug: false,
};

HashconnectProvider.defaultProps = defaultProps;

export default HashconnectProvider;

export function useHashConnect() {
  const value = useContext(HashConnectContext);
  return value;
}
