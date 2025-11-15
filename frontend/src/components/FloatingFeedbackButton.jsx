import React, { useState } from "react";
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Feedback as FeedbackIcon } from "@mui/icons-material";
import axios from "axios";

const FloatingFeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (feedback.trim() === "") {
      setSnackbar({
        open: true,
        message: "Por favor, escreva seu feedback.",
        severity: "warning",
      });
      return;
    }

    try {
      // Substitua pela sua URL de API de feedback
      await axios.post("/api/feedback", { message: feedback });
      setSnackbar({
        open: true,
        message: "Feedback enviado com sucesso! Obrigado.",
        severity: "success",
      });
      setFeedback("");
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao enviar feedback. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Tooltip title="Enviar Feedback">
        <Fab
          color="primary"
          aria-label="feedback"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1300,
          }}
        >
          <FeedbackIcon />
        </Fab>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Conte-nos o que você acha!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            label="Seu feedback"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FloatingFeedbackButton;
