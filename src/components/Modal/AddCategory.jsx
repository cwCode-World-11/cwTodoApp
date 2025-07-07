import React, { useState } from "react";
import "./Modal.css"; // Ensure to create a separate CSS file for styles

const AddCategoryModal = ({ isOpen, setIsOpen, handleAddNewCategory }) => {
  const [categoryName, setCategoryName] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setCategoryName("");
    setIsOpen(false);
    return;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          autoFocus
        />
        <div className="btnGroup">
          <button onClick={handleClose} className="modal-button cancel">
            Cancel
          </button>
          <button
            onClick={() => handleAddNewCategory(categoryName, setCategoryName)}
            className="modal-button">
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
