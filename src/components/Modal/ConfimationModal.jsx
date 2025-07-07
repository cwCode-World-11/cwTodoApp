import "./Modal.css"; // Ensure to create a separate CSS file for styles

const ConfirmationModal = ({
  isConfirmOpen,
  setIsConfirmOpen,
  title,
  handleConfirm,
}) => {
  if (!isConfirmOpen) return null;

  const handleClose = () => {
    setIsConfirmOpen(false);
    return;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title || "Are you sure?"}</h2> <br />
        <div className="btnGroup">
          <button onClick={handleClose} className="modal-button cancel">
            Cancel
          </button>
          <button onClick={handleConfirm} className="modal-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
