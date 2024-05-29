import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const BasicModal: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
  CustomeButton?: React.FC<{ onClick: () => void }>;
}> = ({
  children,
  onClose,
  CustomeButton = ({ onClick }) => {
    return (
      <Button onClick={onClick}>
        <AddCircleIcon style={{ fill: "var(--active)", fontSize: "36" }} />
      </Button>
    );
  },
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <CustomeButton onClick={handleOpen} />
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          if (onClose) onClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, borderRadius: "10px" }}>{children}</Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
