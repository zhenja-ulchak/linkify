import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  handleDelete: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, title,description, handleDelete, onClose }) => {
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (counter > 0 && open) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear interval on unmount or when counter reaches 0
    }
  }, [counter, open]);

  const handleConfirmDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          You can delete after {counter} seconds.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmDelete}
          disabled={counter > 0} // Disable the button until counter reaches 0
        >
          Delete
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ marginTop: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
