import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// TODO: https://mui.com/material-ui/react-snackbar/

// Call this as Toast.log("msg")
// Call this as Toast.error("msg")
// Call this as Toast.success("msg")

let toastTrigger;

export function useToast() {
  return {
    log: (msg) =>
      toastTrigger({ isOpen: true, msg, serverity: "info", duration: 10000 }),
    success: (msg) =>
      toastTrigger({ isOpen: true, msg, serverity: "success", duration: 3000 }),
    warning: (msg) =>
      toastTrigger({ isOpen: true, msg, serverity: "warning", duration: 5000 }),
    error: (msg) =>
      toastTrigger({ isOpen: true, msg, serverity: "error", duration: 10000 }),
  };
}

function ToastManager() {
  const [toast, setToast] = useState({
    isOpen: false,
    msg: "",
    serverity: "info", //info,success,warning,error,
    duration: 3000,
  });
  toastTrigger = setToast;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast({ ...toast, isOpen: false });
  };

  return (
    <div>
      <Snackbar
        open={toast.isOpen}
        autoHideDuration={toast.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleClose}
          severity={toast.serverity}
          variant="filled"
          sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ToastManager;
