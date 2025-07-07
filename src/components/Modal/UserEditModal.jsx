import { useEffect, useState } from "react";
import "./Modal.css"; // Ensure to create a separate CSS file for styles

const UserEditModal = ({ isEditOpen, setIsEditOpen, labelName, handleFn }) => {
  const [value, setValue] = useState("");

  if (!isEditOpen) return null;

  const handleClose = () => {
    setValue("");
    setIsEditOpen(false);
    return;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Field</h2>
        <input
          type="text"
          placeholder={"Edit " + labelName}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="btnGroup">
          <button onClick={handleClose} className="modal-button cancel">
            Cancel
          </button>
          <button
            onClick={() => handleFn(value, setIsEditOpen)}
            className="modal-button"
          >
            {"Change " + labelName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
