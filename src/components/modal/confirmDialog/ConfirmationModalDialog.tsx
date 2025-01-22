import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface ConfirmChangeModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirmNew: () => void;
  onRevertOld: () => void;
  onClose: () => void;
}

const ConfirmChangeModal: React.FC<ConfirmChangeModalProps> = ({
  open,
  title,
  description,
  onConfirmNew,
  onRevertOld,
  onClose,
}) => {
  const t = useTranslations("API");

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onConfirmNew();
              onClose();
            }}
          >
            {t("confirmNewValue")} {/* Переклад: залишити нове */}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              onRevertOld();
              onClose();
            }}
          >
            {t("revertOldValue")} {/* Переклад: повернути старе */}
          </Button>
        </Box>
        <Button variant="text" onClick={onClose} sx={{ marginTop: 2 }}>
          {t("cancel")}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmChangeModal;
