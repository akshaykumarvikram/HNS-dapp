import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormHelperText,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Container,
} from "@mui/material";
import { storage, db } from "src/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUserAuth } from "src/contexts/UserAuthContextProvider";
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

export default function CreateChannel() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [channelCreated, setChannelCreated] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const { user } = useUserAuth();
  const validationSchema = Yup.object().shape({
    channelName: Yup.string().required("Channel name is required"),
    displayName: Yup.string()
      .required("Display name is required")
      .min(4, "Display name must be at least 4 characters")
      .max(30, "Display name must not exceed 20 characters"),
    filePath: Yup.mixed().required("Valid Logo file is required."),
    description: Yup.string()
      .required("Description name is required")
      .min(15, "Description name must be at least 15 characters")
      .max(400, "Description name must not exceed 100 characters"),
    personalized: Yup.bool(),
    broadcast: Yup.bool(),
    onchain: Yup.bool(),
    contractAddress: Yup.string().when("onchain", {
      is: true,
      then: Yup.string()
        .required("Description name is required")
        .matches(/^[0].[0].[0-9]{8}$/, "Must be of format 0.0.xxxxxxxx")
        .min(12, "Must be of format 0.0.xxxxxxxx")
        .max(12, "Must be of format 0.0.xxxxxxxx"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      channelName: "",
      displayName: "",
      filePath: false,
      fileUrl: false,
      description: "",
      personalized: true,
      broadcast: true,
      onchain: false,
      contractAddress: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      // Upload Logo firestorage
      const filename = `${user.uid}-${values.channelName}-${values.filePath.name}`;
      const storagePath = `/channel-logos/${filename}`;
      console.log(storagePath);
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, values.filePath);
      console.log(snapshot)
      const url = await getDownloadURL(snapshot.ref)
    //   const url = storageRef.toString();
      console.log("Logo URL: ", url);
      //   uploadBytes(storageRef, values.filePath).then((snapshot) => {
      //     console.log('Uploaded logo successfully!', storageRef);
      //   })
      const data = {
        channelName: values.channelName,
        displayName: values.displayName,
        description: values.description,
        logoPath: url,
        createdBy: user.uid,
        createdAt: new Date(),
        personalizedMessages: values.personalized,
        broadcastMessages: values.broadcast,
        onchainMessages: values.onchain,
        smartContractAddress: values.contractAddress,
        subscriberCount: {
            personalized: 0,
            broadcast: 0,
            onchain: 0
        }
      };
      const docRef = await addDoc(collection(db, "channels"), data);
      setChannelCreated(docRef.id);
      setAlert(true);
      setLoading(false);
      //   alert(`Document added with ID: ${docRef.id}`);
      //   console.log("Document added with ID: ", docRef.id);
    },
  });

  const handleDialogClose = () => {
    formik.resetForm();
    handleClose();
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(null);
  };

  return (
    <>
    <Box
      display="flex" 
      alignItems="center"
      justifyContent="center"
      style={{ height: "70vh"}}
    >
        {/* <Button
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                     Create a new channel
                </Button> */}
      <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddTwoToneIcon />} style={{
          maxWidth: "300px",
          maxHeight: "75px",
          minWidth: "200px",
          minHeight: "50px",
          fontSize: 18
        }}>
          Create a new channel
        </Button>
    </Box>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Channel</DialogTitle>
        <DialogContent>
          <React.Fragment>
            {/* <Typography variant="h6" gutterBottom>
            Shipping address
          </Typography> */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} marginTop={1}>
                <TextField
                  required
                  id="channelName"
                  name="channelName"
                  label="Channel Name"
                  value={formik.values.channelName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.channelName &&
                    Boolean(formik.errors.channelName)
                  }
                  helperText={
                    formik.touched.channelName && formik.errors.channelName
                  }
                  fullWidth
                  autoComplete="channel-name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} marginTop={1}>
                <TextField
                  required
                  id="displayName"
                  name="displayName"
                  label="Display Name"
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.displayName &&
                    Boolean(formik.errors.displayName)
                  }
                  helperText={
                    formik.touched.displayName && formik.errors.displayName
                  }
                  fullWidth
                  autoComplete="display-name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="description"
                  name="description"
                  label="Channel Description"
                  multiline
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  autoComplete="channel-descrition"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="filePath"
                  name="filePath"
                  label="Upload logo"
                  // style={{ margin: 8 }}
                  type="file"
                  fullWidth
                  margin="normal"
                  onChange={(event) => {
                    formik.setFieldValue("filePath", event.target.files[0]);
                  }}
                  error={
                    formik.touched.filePath && Boolean(formik.errors.filePath)
                  }
                  helperText={
                    formik.touched.filePath
                      ? formik.errors.filePath
                      : "Logo is needed"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                {formik.values.filePath && (
                  <Card sx={{ maxWidth: 128 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        alt="Logo"
                        height="128"
                        image={URL.createObjectURL(formik.values.filePath)}
                        title="Logo"
                      />
                    </CardActionArea>
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    border: 1,
                    borderRadius: 1,
                    borderColor: "grey.400",
                  }}
                >
                  <FormControl sx={{ m: 1 }} component="fieldset">
                    <FormLabel component="legend">
                      Types of messages you would like to send
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.personalized}
                            onChange={(event) => {
                              formik.setFieldValue(
                                "personalized",
                                event.target.checked
                              );
                            }}
                            name="personalized"
                          />
                        }
                        label="Personalized "
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.onchain}
                            onChange={(event) => {
                              formik.setFieldValue(
                                "onchain",
                                event.target.checked
                              );
                            }}
                            name="onchain"
                          />
                        }
                        label="Onchain"
                      />
                      {formik.values.onchain && (
                        <TextField
                          id="contractAddress"
                          name="contractAddress"
                          label="Smart Contract Address"
                          fullWidth
                          variant="outlined"
                          value={formik.values.contractAddress}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.contractAddress &&
                            Boolean(formik.errors.contractAddress)
                          }
                          helperText={
                            formik.touched.contractAddress &&
                            formik.errors.contractAddress
                          }
                        />
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.broadcast}
                            onChange={(event) => {
                              formik.setFieldValue(
                                "broadcast",
                                event.target.checked
                              );
                            }}
                            name="broadcast"
                          />
                        }
                        label="Broadcast"
                      />
                    </FormGroup>
                    <FormHelperText>You can select multiple</FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Snackbar
                  open={alert}
                  autoHideDuration={6000}
                  onClose={handleAlertClose}
                >
                  <Alert
                    onClose={handleAlertClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Channel Created successfully. ChannelID: {channelCreated}
                  </Alert>
                </Snackbar>
              </Grid>
            </Grid>
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit}>Create Channel</Button>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </>
  );
}
