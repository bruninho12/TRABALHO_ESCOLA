import React from "react";
import { Box, Tooltip, Fade } from "@mui/material";
import { CheckCircle, Cancel, Warning, Info } from "@mui/icons-material";
import { colors } from "../../styles/designSystem";

const FieldValidationIndicator = ({
  isValid,
  isInvalid,
  message,
  showSuccess = true,
  type = "email", // "email", "password", "text"
}) => {
  const getIcon = () => {
    if (isValid && showSuccess) {
      return <CheckCircle sx={{ color: colors.success.main, fontSize: 20 }} />;
    }
    if (isInvalid) {
      return <Cancel sx={{ color: colors.error.main, fontSize: 20 }} />;
    }
    if (type === "password") {
      return <Info sx={{ color: colors.info.main, fontSize: 20 }} />;
    }
    return null;
  };

  const shouldShow =
    (isValid && showSuccess) || isInvalid || (type === "password" && message);

  return (
    <Fade in={shouldShow}>
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        {message ? (
          <Tooltip title={message} placement="top" arrow>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {getIcon()}
            </Box>
          </Tooltip>
        ) : (
          getIcon()
        )}
      </Box>
    </Fade>
  );
};

export default FieldValidationIndicator;
